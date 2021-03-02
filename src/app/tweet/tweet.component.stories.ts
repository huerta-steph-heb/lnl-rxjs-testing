import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { MortarModule } from '../mortar.module';
import { TweetComponent } from './tweet.component';

export default {
  title: 'Tweet',
  decorators: [
    moduleMetadata({
      imports: [
        MortarModule,
      ],
      declarations: [TweetComponent],
    }),
  ],
} as Meta;

const Template: Story<TweetComponent> = (args: TweetComponent) => ({
  component: TweetComponent,
  props: args,
});

export const WithImage = Template.bind({});
WithImage.args = {
  displayName: 'H-E-B Partner',
  username: 'heb_partner',
  text: 'what if we kissed.... in the HEB white claw love shack 😳 😳 😳',
  imageUrl: 'https://pbs.twimg.com/media/ENa8kV-XYAELI0D?format=jpg&name=large',
};
