
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  {
    oldName: "DEBT",
    newName: "CHRS",
    imageUrl: "/lovable-uploads/070fbee2-f928-4140-9dfb-4c6f752c659f.png",
    gradientClass: "from-[#00FF8C] to-[#7BFFC9]"
  },
  {
    oldName: "DLG",
    newName: "DGLD",
    imageUrl: "/lovable-uploads/c41740a7-9f80-4df5-9083-789e5248aeea.png",
    gradientClass: "from-[#FFD000] to-[#FFE47B]"
  },
  {
    oldName: "DCM",
    newName: "DATA",
    imageUrl: "/lovable-uploads/67daa9a8-1866-4384-98c2-9f5011696b0a.png",
    gradientClass: "from-[#4A00FF] to-[#B27BFF]"
  },
  {
    oldName: "ALUM",
    newName: "BAUX",
    imageUrl: "/lovable-uploads/7a3c20a6-7485-45e6-8320-e98a4fa6db12.png",
    gradientClass: "from-[#FF5200] to-[#FFAB7B]"
  },
  {
    oldName: "XPLR",
    newName: "EXPL",
    imageUrl: "/lovable-uploads/edd32582-f472-48fc-8ee7-db1de87f784b.png",
    gradientClass: "from-[#FF1A88] to-[#FF7BC4]"
  },
  {
    oldName: "GROW",
    newName: "FARM",
    imageUrl: "/lovable-uploads/5165e38d-462a-4215-94b3-66aa34954dd3.png",
    gradientClass: "from-[#C4A42B] to-[#E8D690]"
  },
  {
    oldName: "NATG",
    newName: "NGAS",
    imageUrl: "/lovable-uploads/0c05b097-c119-46c3-97e0-3b0ed755a624.png",
    gradientClass: "from-[#2970FF] to-[#7BB1FF]"
  },
  {
    oldName: "BGLD",
    newName: "OIL",
    imageUrl: "/lovable-uploads/fbbbb513-115d-4184-97d3-94b2cda2539b.png",
    gradientClass: "from-[#5C00FF] to-[#B47BFF]"
  }
];

export const ProjectTransitions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {projects.map((project) => (
        <div
          key={project.oldName}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-lg blur-xl -z-10" />
          <Card className="backdrop-blur-sm bg-black/40 border-[0.5px] border-white/10 overflow-hidden transition-colors hover:bg-black/60">
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10" />
                <img
                  src={project.imageUrl}
                  alt={project.newName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                
                {/* Cyberpunk-style grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_transparent_0%,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-30" />
                
                {/* Circuit-like pattern */}
                <div className="absolute -inset-1 border-[0.5px] border-white/10 rounded opacity-50" 
                     style={{ 
                       backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                       backgroundSize: '24px 24px'
                     }} 
                />
              </div>
              
              <div className="space-y-2 text-center relative">
                <div className="text-sm text-muted-foreground/60 line-through tracking-wider font-mono">
                  {project.oldName}
                </div>
                <div className={`font-bold text-lg tracking-[0.2em] font-mono bg-gradient-to-r ${project.gradientClass} bg-clip-text text-transparent`}>
                  {project.newName}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
