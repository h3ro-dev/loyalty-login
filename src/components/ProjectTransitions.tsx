
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  {
    oldName: "DEBT",
    newName: "CHRS",
    imageUrl: "/lovable-uploads/070fbee2-f928-4140-9dfb-4c6f752c659f.png"
  },
  {
    oldName: "DLG",
    newName: "DGLD",
    imageUrl: "/lovable-uploads/c41740a7-9f80-4df5-9083-789e5248aeea.png"
  },
  {
    oldName: "DCM",
    newName: "Data",
    imageUrl: "/lovable-uploads/67daa9a8-1866-4384-98c2-9f5011696b0a.png"
  },
  {
    oldName: "ALUM",
    newName: "BAUX",
    imageUrl: "/lovable-uploads/7a3c20a6-7485-45e6-8320-e98a4fa6db12.png"
  },
  {
    oldName: "XPLR",
    newName: "EXPL",
    imageUrl: "/lovable-uploads/edd32582-f472-48fc-8ee7-db1de87f784b.png"
  },
  {
    oldName: "GROW",
    newName: "FARM",
    imageUrl: "/lovable-uploads/5165e38d-462a-4215-94b3-66aa34954dd3.png"
  },
  {
    oldName: "NATG",
    newName: "NGAS",
    imageUrl: "/lovable-uploads/0c05b097-c119-46c3-97e0-3b0ed755a624.png"
  },
  {
    oldName: "BGLD",
    newName: "Oil",
    imageUrl: "/lovable-uploads/fbbbb513-115d-4184-97d3-94b2cda2539b.png"
  }
];

export const ProjectTransitions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.oldName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4">
                <img
                  src={project.imageUrl}
                  alt={project.newName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="space-y-2 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="text-sm text-muted-foreground line-through"
                >
                  {project.oldName}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-semibold text-lg"
                >
                  {project.newName}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
