'use client';

import { Activity, TrendingUp, Shield, Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animated-gradient">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-chart-4/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-foreground">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center glow-border-primary">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">FinanceFlow</span>
          </div>
          
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight text-balance">
                Take Control of Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-chart-4">
                  Financial Future
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                A state-of-the-art dashboard that transforms complex financial data into actionable insights.
              </p>
            </div>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard 
                icon={<TrendingUp className="w-5 h-5" />}
                title="Real-time Analytics"
                description="Track spending patterns instantly"
              />
              <FeatureCard 
                icon={<Shield className="w-5 h-5" />}
                title="Secure & Private"
                description="Bank-level encryption"
              />
              <FeatureCard 
                icon={<Zap className="w-5 h-5" />}
                title="Smart Insights"
                description="AI-powered recommendations"
              />
              <FeatureCard 
                icon={<Activity className="w-5 h-5" />}
                title="Anomaly Detection"
                description="Catch unusual spending"
              />
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-sm text-muted-foreground">
            Trusted by 50,000+ users worldwide
          </p>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center lg:hidden gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">FinanceFlow</span>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </div>
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
    <div className="glass-card rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:glow-border-primary">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
