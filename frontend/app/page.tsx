'use client';


import { Activity, ArrowRight, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background animated-gradient overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-chart-4/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center glow-border-primary">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">FinanceFlow</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:bg-secondary/50">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90 hover:glow-primary">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-16 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Zap className="w-4 h-4" />
            <span>Intelligent Finance Management</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Take Control of Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-chart-4 animate-pulse-glow">
              Financial Future
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A state-of-the-art dashboard that transforms complex financial data into actionable insights. 
            Track, analyze, and optimize your finances with AI-powered intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 hover:glow-primary group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg bg-secondary/30 border-border/50 hover:bg-secondary/50 hover:border-primary/50"
              >
                View Demo
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-muted-foreground pt-4">
            Trusted by 50,000+ users worldwide. No credit card required.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Real-time Analytics"
            description="Track your spending patterns and income trends with beautiful, interactive visualizations updated in real-time."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Secure & Private"
            description="Bank-level encryption protects your financial data. Your privacy is our top priority with RBAC access controls."
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Smart Insights"
            description="AI-powered recommendations help you identify spending anomalies and optimize your financial health."
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-border-primary group">
      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
