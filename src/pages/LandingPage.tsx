import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Home, Heart, Shield, Users, MapPin, Sparkles, Zap, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const LandingPageAnimated: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const phrases = [
    "Lost your home?",
    "We're here to help.",
    "Let's rebuild together."
  ];

  useEffect(() => {
    if (currentPhrase >= phrases.length) return;

    const phrase = phrases[currentPhrase];
    let index = 0;

    const timer = setInterval(() => {
      if (index <= phrase.length) {
        setDisplayedText(phrase.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          if (currentPhrase < phrases.length - 1) {
            setCurrentPhrase(prev => prev + 1);
            setDisplayedText('');
          }
        }, 1500);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [currentPhrase]);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/emergency-housing');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div 
          style={{ opacity }}
          className="container max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
          </motion.div>

          {/* Animated Headline */}
          <div className="mb-12 min-h-[240px] flex flex-col items-center justify-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1 h-16 md:h-20 bg-secondary ml-2 align-middle"
              />
            </motion.h1>
            
            {currentPhrase === phrases.length - 1 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12"
              >
                AI-powered platform connecting displaced families with safe housing, 
                humanitarian support, and a path to rebuild their lives.
              </motion.p>
            )}
          </div>

          {currentPhrase === phrases.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                  onClick={handleGetStarted}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Find Emergency Housing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              {!user && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-10 py-6"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Stats */}
          {currentPhrase === phrases.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 pt-12 border-t border-border/50"
            >
              {[
                { value: '1,200+', label: 'Families Helped' },
                { value: '500+', label: 'Safe Homes' },
                { value: '24/7', label: 'AI Support' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Mission Section */}
      <ScrollRevealSection>
        <div className="container py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How We Help You Find <span className="text-secondary">Safety</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform connects displaced families with safe housing options, 
              humanitarian partners, and supportive communities worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Emergency Housing',
                description: 'Immediate access to safe shelters and temporary housing for families in crisis situations.',
                color: 'text-secondary'
              },
              {
                icon: Sparkles,
                title: 'AI Matching',
                description: 'Our AI understands your situation and matches you with the most suitable housing options.',
                color: 'text-primary'
              },
              {
                icon: Users,
                title: 'Community Support',
                description: 'Connect with humanitarian organizations, local communities, and support networks.',
                color: 'text-secondary'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <Card className="h-full border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="pt-8 text-center">
                    <motion.div
                      className={`mx-auto w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className={`h-10 w-10 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* How It Works */}
      <ScrollRevealSection className="bg-muted/30">
        <div className="container py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Journey to <span className="text-secondary">Safety</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find your safe place
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-12">
            {[
              {
                step: '01',
                title: 'Tell Us Your Story',
                description: 'Share your situation, needs, and preferences. Our AI listens and understands.',
                icon: Heart
              },
              {
                step: '02',
                title: 'AI Finds Your Match',
                description: 'Our intelligent system searches thousands of safe housing options and humanitarian resources.',
                icon: Zap
              },
              {
                step: '03',
                title: 'Start Your New Beginning',
                description: 'Connect directly with property owners, receive support, and rebuild your life.',
                icon: Home
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-start gap-8"
              >
                <div className="flex-shrink-0">
                  <motion.div
                    className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground font-bold text-2xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.step}
                  </motion.div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <step.icon className="h-8 w-8 text-secondary" />
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* CTA Section */}
      <ScrollRevealSection>
        <div className="container py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2 border-secondary/50 bg-gradient-to-br from-secondary/5 to-primary/5 overflow-hidden relative">
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />
              <CardContent className="pt-16 pb-16 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Find Your <span className="text-secondary">Safe Place</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Whether you need emergency housing or are looking for a new home, 
                  we're here to help you every step of the way.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="text-xl px-12 py-7 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-2xl"
                    onClick={handleGetStarted}
                  >
                    <Shield className="mr-3 h-6 w-6" />
                    Get Started Now
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </ScrollRevealSection>
    </div>
  );
};

// Scroll Reveal Section Component
const ScrollRevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default LandingPageAnimated;
