import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Search, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background radial glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-emerald-800 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] clip-path-polygon"></div>
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Advanced SEO Intelligence
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-heading font-bold tracking-tight text-foreground">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">SEO Toolkit</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Analyze websites, uncover technical issues, and optimize your content with real-time insights to dominate search rankings.
          </p>
        </motion.div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate("/analyzer")}
            className="group cursor-pointer rounded-2xl border border-border/50 bg-card p-8 shadow-sm hover:shadow-glow hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col items-start text-left"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Search className="h-40 w-40 text-primary -translate-y-10 translate-x-10" />
            </div>
            
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Search className="h-7 w-7 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold font-heading mb-3">Website Analyzer</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 relative z-10">
              Run comprehensive technical SEO audits. Discover broken links, missing meta tags, heading structures, and performance metrics instantly.
            </p>
            
            <div className="mt-auto flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
              Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => navigate("/optimizer")}
            className="group cursor-pointer rounded-2xl border border-border/50 bg-card p-8 shadow-sm hover:shadow-glow hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col items-start text-left"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="h-40 w-40 text-primary -translate-y-10 translate-x-10" />
            </div>
            
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold font-heading mb-3">Content Optimizer</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 relative z-10">
              Write perfectly optimized articles. Track keyword density, analyze readability, and follow real-time suggestions to rank higher.
            </p>
            
            <div className="mt-auto flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
              Optimize Content <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Index;