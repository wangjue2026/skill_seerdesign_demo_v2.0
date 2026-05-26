import { message } from 'ant-design-vue';

// Configure Ant Design Vue's message defaults to conform to comp-message.md
message.config({
  top: '15%',
  maxCount: 5,
  duration: 3
});

export const SdMessage = message;

export { default as SdButton } from './SdButton.vue';
export { default as SdSwitch } from './SdSwitch.vue';
export { default as SdTable } from './SdTable.vue';
export { default as SdSelect } from './SdSelect.vue';
export { default as SdForm } from './SdForm.vue';
export { default as SdDrawer } from './SdDrawer.vue';
export { default as SdSearch } from './SdSearch.vue';

// Newly added SeerDesign wrap components
export { default as SdAlert } from './SdAlert.vue';
export { default as SdCheckbox } from './SdCheckbox.vue';
export { default as SdRadio } from './SdRadio.vue';
export { default as SdRadioConfigPanel } from './SdRadioConfigPanel.vue';
export { default as SdDatePicker } from './SdDatePicker.vue';
export { default as SdDetailCard } from './SdDetailCard.vue';
export { default as SdInput } from './SdInput.vue';
export { default as SdModal } from './SdModal.vue';
export { default as SdPageTitle } from './SdPageTitle.vue';
export { default as SdTabs } from './SdTabs.vue';
export { default as SdTag } from './SdTag.vue';
export { default as SdTree } from './SdTree.vue';
