import { MessageSquare, Car } from "lucide-react";

const QuestionBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
        {/* Ask a Question */}
        <div className="flex items-center gap-3 flex-1 max-w-md px-4 py-2 bg-secondary rounded-full">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Ask a Question</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            "Compare Model 3 and Model Y"
          </span>
        </div>

        {/* Schedule a Drive */}
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full hover:bg-secondary transition-colors">
          <Car className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Schedule a Drive Today</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionBar;
