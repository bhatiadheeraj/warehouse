<template>
  <b-modal id="ezgov-import-modal" title="Import from ezGOV" @ok="importDocument">
    <b-form-group label="Select Project">
      <b-form-select v-model="selectedProject" @change="onProjectSelect" :options="projectOptions">
        <template #first>
          <option :value="null" disabled>Select Project</option>
        </template>
      </b-form-select>
    </b-form-group>

    <b-form-group label="Select Document" v-if="selectedProject">
      <b-form-select v-model="selectedDocument">
        <template #first>
          <option :value="null" disabled>Select Document</option>
        </template>
        <optgroup v-for="(docs, type) in groupedDocumentOptions" :label="type" :key="type">
          <option v-for="doc in docs" :key="doc.value._id" :value="doc.value" :disabled="doc.disabled">
            {{ doc.text }}
          </option>
        </optgroup>
      </b-form-select>
    </b-form-group>
  </b-modal>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      projects: [],
      selectedProject: null,
      selectedDocument: null
    };
  },
  computed: {
    projectOptions() {
      return this.projects.map(project => ({ value: project, text: project.title }));
    },
    groupedDocumentOptions() {
      if (this.selectedProject) {
        const groups = {};
        this.selectedProject.documents.forEach(doc => {
          if(doc.type === 'DUA') {
            const fileExtension = doc.fileName.split('.').pop().toLowerCase();
            let isSupported = ['txt', 'pdf', 'docx'].includes(fileExtension);
            if(doc.template) isSupported = true;
            const groupName = doc.type || 'Other';

            if (!groups[groupName]) {
              groups[groupName] = [];
            }

            groups[groupName].push({ value: doc, text: doc.fileName, disabled: !isSupported });
          }
        });
        return groups;
      }
      return {};
    }
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.get('ezgov/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    onProjectSelect() {
      this.selectedDocument = null;
    },
    async importDocument() {
      if (this.selectedProject && this.selectedDocument) {
        try {
          const response = await axios.get(`ezgov/project/${this.selectedProject._id}/file/${this.selectedDocument._id}/getText`);
          this.$emit('importedText', response.data);
        } catch (error) {
          this.$notify({ text: 'Error Parsing the File: ' + error, type: 'error' });
        }
      }
    }
  },
  mounted() {
    this.fetchProjects();
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
