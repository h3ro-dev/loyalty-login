
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export const LegalDisclaimer = () => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <Alert 
          variant="destructive" 
          className="border-l-4 border-l-destructive bg-[#1A1111] text-[#F1F1F1]"
        >
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="font-medium mb-2">KYC Verification Warning</AlertTitle>
          <AlertDescription className="text-[#E5E5E5]">
            Falsified KYC information will be reported to proper authorities. All submissions undergo independent review and verification.
          </AlertDescription>
        </Alert>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Alert 
          variant="destructive" 
          className="border-l-4 border-l-destructive bg-[#1A1111] text-[#F1F1F1]"
        >
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="font-medium mb-2">US Citizens Notice</AlertTitle>
          <AlertDescription className="text-[#E5E5E5]">
            US Citizens are subject to Expanded Due Diligence (EDD) and may be subject to additional reporting requirements.
          </AlertDescription>
        </Alert>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Alert 
          className="border-l-4 border-l-muted bg-[#1A1111]/80 text-[#F1F1F1]"
        >
          <AlertTitle className="font-medium mb-2">Additional Verification Notice</AlertTitle>
          <AlertDescription className="text-[#E5E5E5]">
            If additional information is needed to validate your wallet, you will be contacted. Required information for further verification may include: Primary Residential Address, Phone Number, Date of Purchase of particular NFTs, Method of Purchase, and Sales Channel.
          </AlertDescription>
        </Alert>
      </motion.div>
    </motion.div>
  );
};
