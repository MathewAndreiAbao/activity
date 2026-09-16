<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <PhotoGrid :photos="photos" @select="selectedPhoto = $event" />

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="onTakePhoto">
          <ion-icon :icon="cameraOutline" />
        </ion-fab-button>
      </ion-fab>

      <PhotoViewerModal
        :photo="selectedPhoto"
        @close="selectedPhoto = null"
        @delete="onDeletePhoto"
      />

      <ion-toast
        :is-open="errorMessage !== ''"
        :message="errorMessage"
        :duration="2500"
        color="danger"
        @did-dismiss="errorMessage = ''"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToast,
} from '@ionic/vue';
import { cameraOutline } from 'ionicons/icons';
import PhotoGrid from '@/components/PhotoGrid.vue';
import PhotoViewerModal from '@/components/PhotoViewerModal.vue';
import { usePhotoGallery, type Photo } from '@/composables/usePhotoGallery';

const { photos, load, takePhoto, deletePhoto } = usePhotoGallery();
const selectedPhoto = ref<Photo | null>(null);
const errorMessage = ref('');

onMounted(load);

const onTakePhoto = async () => {
  try {
    await takePhoto();
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Could not take a photo. Please try again.';
  }
};

const onDeletePhoto = async (photo: Photo) => {
  await deletePhoto(photo);
  selectedPhoto.value = null;
};
</script>
