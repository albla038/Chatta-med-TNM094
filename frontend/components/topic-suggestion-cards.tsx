import { Card, CardContent } from "./ui/card";
import { motion } from "motion/react";

type topicClickType = {
  handleTopicClick: (input: string) => void;
  topicSuggestionsList: string[];
};

export default function TopicSuggestionCards({
  handleTopicClick,
  topicSuggestionsList,
}: topicClickType) {
  // const transition = {
  //   duration: 0.8s;
  // }
  return (
    <div className="h-full flex flex-col justify-center items-center mx-4">
      <h2 className="text-2xl font-semibold p-6 text-center">
        Hur kan jag hjälpa dig idag?
      </h2>

      <ul className="grid grid-cols-1 gap-6 min-[24rem]:grid-cols-2">
        {topicSuggestionsList.map((topic, id) => (
          <motion.li
            key={id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Card
              className="max-w-xs shadow-none hover:drop-shadow-[0_4px_4px_rgba (0, 0, 0, 0.03)] cursor-pointer h-full flex justify-center select-none"
              onClick={() => handleTopicClick(topic)}
            >
              <CardContent>
                <div>{topic}</div>
              </CardContent>
            </Card>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
