import { Card } from "@jpmorganchase/uitk-lab";
import { ComponentMeta, ComponentStory } from "@storybook/react-webpack5";
import { AllRenderer, QAContainer } from "docs/components";
import "./card.qa.stories.css";

export default {
  title: "Lab/Card/QA",
  component: Card,
} as ComponentMeta<typeof Card>;

export const AllExamplesGrid: ComponentStory<typeof Card> = () => {
  return (
    <AllRenderer>
      <Card className="uitkCardQA">
        <div>
          <h1 style={{ margin: 0 }}>Card with density</h1>
          <span>Content</span>
        </div>
      </Card>
    </AllRenderer>
  );
};

export const CompareWithOriginalToolkit: ComponentStory<typeof Card> = () => {
  return (
    <QAContainer
      width={600}
      height={636}
      className="uitkCardQA"
      imgSrc="/visual-regression-screenshots/Card-vr-snapshot.png"
    >
      <AllExamplesGrid />
    </QAContainer>
  );
};
