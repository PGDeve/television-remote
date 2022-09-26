import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Header as AppHeader } from "./Header";

export default {
  title: "Header",
  component: AppHeader,
} as ComponentMeta<typeof AppHeader>;

const Template: ComponentStory<typeof AppHeader> = (args) => (
  <AppHeader {...args} />
);

export const Header = Template.bind({});
Header.args = {
  code: "000",
  description: "Channel Zero",
};
