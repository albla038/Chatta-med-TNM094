import { Card, CardContent } from "./ui/card";

type topicClickType = {
  handleTopicClick: (input: string) => void;
  topicSuggestionsList: string[];
};

export default function TopicSuggestionCards({
  handleTopicClick,
  topicSuggestionsList,
}: topicClickType) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold p-6 text-center">
        Hur kan jag hjälpa dig idag?
      </h2>
      <ul className="grid grid-cols-1 gap-6 min-[24rem]:grid-cols-2">
        {topicSuggestionsList.map((topic, id) => (
          <li key={id}>
            <Card
              className="max-w-xs shadow-none hover:drop-shadow-xs cursor-pointer h-full flex justify-center select-none"
              onClick={() => handleTopicClick(topic)}
            >
              <CardContent>
                <div>{topic}</div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
