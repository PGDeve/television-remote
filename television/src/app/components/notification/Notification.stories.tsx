import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Notification as AppNotification } from "./Notification";

export default {
  title: "Notification",
  component: AppNotification,
  args: {
    autoHide: true,
    error: {
      title: "An Error Occurred!",
      description: "This is the error description",
    },
    removeNotification: () => {},
    transitionDuration: 300,
  },
} as ComponentMeta<typeof AppNotification>;

export const Notification: ComponentStory<typeof AppNotification> = (args) => (
  <AppNotification {...args} />
);
