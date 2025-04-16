import MarkdownRenderer from "./markdown";

import { motion } from "motion/react";

type AssistantMessageProps = {
  children?: React.ReactNode;
  message: string;
};

export default function AssistantMessage({
  children,
  message,
}: AssistantMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full break-keep text-justify"
    >
      <MarkdownRenderer message={message} />
      {children}
    </motion.div>
  );
}
