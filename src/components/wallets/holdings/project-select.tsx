
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { HoldingsFormValues } from "@/hooks/use-holdings-form";

interface ProjectSelectProps {
  form: UseFormReturn<HoldingsFormValues>;
  onProjectChange: (value: string) => void;
}

const projectOptions = [
  { value: "DEBT", label: "DEBT" },
  { value: "DLG", label: "DLG" },
  { value: "ALUM", label: "ALUM" },
  { value: "XPLR", label: "XPLR" },
  { value: "BGLD", label: "BGLD" },
  { value: "NATG", label: "NATG" },
  { value: "DCM", label: "DCM" },
  { value: "GROW", label: "GROW" },
];

export function ProjectSelect({ form, onProjectChange }: ProjectSelectProps) {
  return (
    <FormField
      control={form.control}
      name="project_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project</FormLabel>
          <Select
            value={field.value}
            onValueChange={onProjectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projectOptions.map((project) => (
                <SelectItem key={project.value} value={project.value}>
                  {project.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
