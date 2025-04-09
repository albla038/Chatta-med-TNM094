import { Card, CardContent } from "./ui/card";

type topicClickType = {
  handleTopicClick: () => void;
  topicSuggestionsList: string[];
};

export default function TopicSuggestionCard({
  handleTopicClick,
  topicSuggestionsList,
}: topicClickType) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl p-4">Förslag på frågor</h2>
      <ul className="grid grid-cols-2 gap-6">
        {topicSuggestionsList.map((topic, id) => (
          <li key={id}>
            <Card
              className="max-w-xs shadow-none hover:shadow-xs cursor-pointer select-none"
              onClick={handleTopicClick}
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
