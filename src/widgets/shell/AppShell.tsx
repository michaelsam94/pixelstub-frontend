import { motion } from "framer-motion";
import { PlaceholderBuilder } from "../../features/placeholder-builder/ui/PlaceholderBuilder";

export function AppShell() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PlaceholderBuilder />
    </motion.div>
  );
}
