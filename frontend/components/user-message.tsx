import { motion } from "motion/react";

type UserMessageProps = {
  children: React.ReactNode;
};

export default function UserMessage({ children }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-liu-primary/20 rounded-3xl py-3 px-5 w-fit break-keep whitespace-pre"
    >
      {children}
    </motion.div>
  );
}
