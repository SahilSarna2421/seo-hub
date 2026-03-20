import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
      
      <h1 className="text-3xl font-heading font-bold">
        SEO Toolkit
      </h1>

      <p className="text-muted-foreground">
        Choose a tool
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/analyzer")}
          className="px-6 py-3 rounded-lg bg-secondary text-white"
        >
          Website Analyzer
        </button>

        <button
          onClick={() => navigate("/optimizer")}
          className="px-6 py-3 rounded-lg bg-secondary text-white"
        >
          Content Optimizer
        </button>
      </div>

    </div>
  );
};

export default Index;