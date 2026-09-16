import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = new Map<string, string>();

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(async ({ key }: { key: string }) => ({ value: store.get(key) ?? null })),
    set: vi.fn(async ({ key, value }: { key: string; value: string }) => {
      store.set(key, value);
    }),
  },
}));

vi.mock('@capacitor/camera', () => ({
  Camera: {
    getPhoto: vi.fn(async () => ({ dataUrl: 'data:image/jpeg;base64,fake' })),
  },
  CameraResultType: { DataUrl: 'dataUrl' },
  CameraSource: { Camera: 'camera' },
}));

import { usePhotoGallery } from '@/composables/usePhotoGallery';

describe('usePhotoGallery', () => {
  beforeEach(() => {
    store.clear();
  });

  it('starts empty until load() reads saved photos', async () => {
    const { photos, load } = usePhotoGallery();
    expect(photos.value).toEqual([]);
    await load();
    expect(photos.value).toEqual([]);
  });

  it('adds a new photo to the front of the list and saves it', async () => {
    const { photos, takePhoto } = usePhotoGallery();
    await takePhoto();
    expect(photos.value).toHaveLength(1);
    expect(photos.value[0].dataUrl).toBe('data:image/jpeg;base64,fake');
    expect(store.get('photos')).toContain('fake');
  });

  it('removes a photo and updates storage', async () => {
    const { photos, takePhoto, deletePhoto } = usePhotoGallery();
    await takePhoto();
    const photo = photos.value[0];

    await deletePhoto(photo);

    expect(photos.value).toHaveLength(0);
    expect(JSON.parse(store.get('photos') ?? '[]')).toEqual([]);
  });

  it('a fresh instance loads what a previous instance saved', async () => {
    const first = usePhotoGallery();
    await first.takePhoto();

    const second = usePhotoGallery();
    await second.load();

    expect(second.photos.value).toHaveLength(1);
    expect(second.photos.value[0].id).toBe(first.photos.value[0].id);
  });
});
