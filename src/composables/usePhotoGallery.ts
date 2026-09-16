import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

/**
 * A photo is just an id (when it was taken) and its image data.
 * Storing the image itself as a data URL means there is no separate
 * file to manage: the string in `dataUrl` IS the picture.
 */
export interface Photo {
  id: string;
  dataUrl: string;
}

const STORAGE_KEY = 'photos';

/**
 * All photo-gallery logic lives in this one place, as three plain steps:
 *   1. load()   - read the saved list from the device when the app starts
 *   2. takePhoto() - add a new photo to the front of the list
 *   3. deletePhoto() - remove one photo from the list
 * Every step ends the same way: update `photos`, then save the whole
 * list back to storage. That single rule is the entire persistence model.
 */
export function usePhotoGallery() {
  const photos = ref<Photo[]>([]);

  const persist = () => {
    return Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(photos.value),
    });
  };

  const load = async () => {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    photos.value = value ? JSON.parse(value) : [];
  };

  const takePhoto = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 90,
    });

    if (!capturedPhoto.dataUrl) {
      return;
    }

    const newPhoto: Photo = {
      id: `${Date.now()}`,
      dataUrl: capturedPhoto.dataUrl,
    };

    photos.value = [newPhoto, ...photos.value];
    await persist();
  };

  const deletePhoto = async (photo: Photo) => {
    photos.value = photos.value.filter((p) => p.id !== photo.id);
    await persist();
  };

  return { photos, load, takePhoto, deletePhoto };
}
