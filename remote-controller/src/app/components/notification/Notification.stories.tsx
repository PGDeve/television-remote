import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Notification } from "./Notification";

export default {
  title: "Notification",
  component: Notification,
  args: {
    autoHide: true,
    error: {
      title: "An Error Occurred!",
      description: "This is the error description",
    },
    removeNotification: () => {},
    transitionDuration: 300,
  },
} as ComponentMeta<typeof Notification>;

const Template: ComponentStory<typeof Notification> = (args) => (
  <Notification {...args} />
);

export const AutoHideNotification = Template.bind({});

export const ClickHideNotification = Template.bind({});
ClickHideNotification.args = {
  autoHide: false,
};
