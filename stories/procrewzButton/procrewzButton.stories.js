import { html } from 'lit';

const ICONS = {
  plus: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>')}`,
  save: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>')}`,
  delete: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>')}`,
  arrowRight: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>')}`,
  download: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>')}`,
  check: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>')}`,
  close: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>')}`,
  settings: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>')}`,
  star: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>')}`,
  heart: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>')}`,
};

const renderButton = (args) => {
  const element = document.createElement('c-procrewz-button');

  Object.entries(args).forEach(([key, value]) => {
    if (key === 'showIcon') return;
    if (key === 'iconType') return;
    if (value !== undefined && value !== null) {
      element[key] = value;
    }
  });

  if (args.showIcon && args.iconType) {
    element.iconUrl = ICONS[args.iconType] || '';
  }

  return element;
};

export default {
  component: 'c-procrewz-button',
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text', description: 'Button text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'navy', 'destructive'],
      description: 'Button style variant'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size'
    },
    disabled: { control: 'boolean', description: 'Disable the button' },
    loading: { control: 'boolean', description: 'Show loading spinner' },
    fullWidth: { control: 'boolean', description: 'Make button full width' },
    showIcon: {
      control: 'boolean',
      description: 'Show icon (for Storybook demos)',
      table: { category: 'Icon' }
    },
    iconType: {
      control: 'select',
      options: ['save', 'delete', 'plus', 'arrowRight', 'download', 'check', 'close', 'settings', 'star', 'heart'],
      description: 'Icon type (for Storybook demos)',
      table: { category: 'Icon' },
      if: { arg: 'showIcon', truthy: true }
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Icon position',
      table: { category: 'Icon' },
      if: { arg: 'showIcon', truthy: true }
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button type'
    }
  },
  render: renderButton
};

const defaultArgs = {
  label: 'Button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  fullWidth: false,
  showIcon: false,
  iconType: 'plus',
  iconPosition: 'left',
  type: 'button'
};

export const Primary = {
  args: { ...defaultArgs, label: 'Primary Button' }
};

export const Secondary = {
  args: { ...defaultArgs, label: 'Secondary Button', variant: 'secondary' }
};

export const Navy = {
  args: { ...defaultArgs, label: 'Navy Button', variant: 'navy' }
};

export const Destructive = {
  args: { ...defaultArgs, label: 'Delete', variant: 'destructive' }
};

export const WithIconLeft = {
  args: { ...defaultArgs, label: 'Save', showIcon: true, iconType: 'save', iconPosition: 'left' }
};

export const WithIconRight = {
  args: { ...defaultArgs, label: 'Continue', variant: 'secondary', showIcon: true, iconType: 'arrowRight', iconPosition: 'right' }
};

export const Small = {
  args: { ...defaultArgs, label: 'Small Button', size: 'small' }
};

export const Large = {
  args: { ...defaultArgs, label: 'Large Button', size: 'large' }
};

export const Loading = {
  args: { ...defaultArgs, label: 'Loading...', loading: true }
};

export const Disabled = {
  args: { ...defaultArgs, label: 'Disabled Button', disabled: true }
};
