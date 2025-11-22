import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertHabitSchema, type InsertHabit, type Habit } from "@shared/schema";

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertHabit) => void;
  editingHabit?: Habit | null;
}

const PRESET_COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(197, 71%, 40%)",
  "hsl(271, 81%, 42%)",
  "hsl(43, 96%, 45%)",
  "hsl(27, 87%, 47%)",
  "hsl(340, 75%, 42%)",
  "hsl(24, 95%, 53%)",
  "hsl(262, 83%, 58%)",
];

export function AddHabitModal({ open, onOpenChange, onSubmit, editingHabit }: AddHabitModalProps) {
  const form = useForm<InsertHabit>({
    resolver: zodResolver(insertHabitSchema),
    defaultValues: {
      name: editingHabit?.name || "",
      color: editingHabit?.color || PRESET_COLORS[0],
    },
  });

  const handleSubmit = (data: InsertHabit) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingHabit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          <DialogDescription>
            {editingHabit ? "Update your habit details." : "Add a new habit to track daily."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Morning meditation, Read 30 minutes"
                      {...field}
                      data-testid="input-habit-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-8 gap-2">
                      {PRESET_COLORS.map((color, index) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={`w-10 h-10 rounded-md transition-all ${
                            field.value === color
                              ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                              : 'hover-elevate'
                          }`}
                          style={{ backgroundColor: color }}
                          data-testid={`button-color-preset-${index}`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose} data-testid="button-cancel-habit">
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-habit">
                {editingHabit ? "Update" : "Create"} Habit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
