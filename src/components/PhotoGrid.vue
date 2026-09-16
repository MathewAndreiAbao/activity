<template>
  <div v-if="photos.length === 0" class="empty-state">
    <ion-icon :icon="imagesOutline" class="empty-icon" />
    <p class="empty-title">No photos yet</p>
    <p class="empty-subtitle">Tap the camera button below to take your first picture.</p>
  </div>

  <ion-grid v-else>
    <ion-row>
      <ion-col
        v-for="photo in photos"
        :key="photo.id"
        size="6"
        size-md="4"
        size-lg="3"
      >
        <ion-img
          :src="photo.dataUrl"
          class="thumbnail"
          @click="$emit('select', photo)"
        />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonGrid, IonRow, IonCol, IonImg, IonIcon } from '@ionic/vue';
import { imagesOutline } from 'ionicons/icons';
import type { Photo } from '@/composables/usePhotoGallery';

defineProps<{ photos: Photo[] }>();
defineEmits<{ (event: 'select', photo: Photo): void }>();
</script>

<style scoped>
.thumbnail {
  width: 100%;
  height: 130px;
  border-radius: 8px;
  cursor: pointer;
}
.thumbnail::part(image) {
  object-fit: cover;
  border-radius: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 24px;
  color: var(--ion-color-medium);
}
.empty-icon {
  font-size: 64px;
}
.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0 4px;
}
.empty-subtitle {
  margin: 0;
}
</style>
