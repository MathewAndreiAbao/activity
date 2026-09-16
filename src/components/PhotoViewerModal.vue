<template>
  <ion-modal :is-open="photo !== null" @did-dismiss="$emit('close')">
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-img v-if="photo" :src="photo.dataUrl" class="full-image" />
      <ion-button
        expand="block"
        color="danger"
        class="delete-button"
        @click="confirmingDelete = true"
      >
        <ion-icon slot="start" :icon="trashOutline" />
        Delete Photo
      </ion-button>
    </ion-content>
  </ion-modal>

  <ion-alert
    :is-open="confirmingDelete"
    header="Delete this photo?"
    message="This cannot be undone."
    :buttons="[
      { text: 'Cancel', role: 'cancel', handler: () => (confirmingDelete = false) },
      { text: 'Delete', role: 'destructive', handler: onConfirmDelete },
    ]"
    @did-dismiss="confirmingDelete = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonImg,
  IonIcon,
  IonAlert,
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import type { Photo } from '@/composables/usePhotoGallery';

const props = defineProps<{ photo: Photo | null }>();
const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'delete', photo: Photo): void;
}>();

const confirmingDelete = ref(false);

const onConfirmDelete = () => {
  confirmingDelete.value = false;
  if (props.photo) {
    emit('delete', props.photo);
  }
};
</script>

<style scoped>
.full-image {
  border-radius: 8px;
}
.delete-button {
  margin-top: 16px;
}
</style>
