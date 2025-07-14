"use client";

import React, { useState } from "react";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "../ui/button";
import { WordRotate } from "../magicui/word-rotate";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { signIn } from "next-auth/react";

export const LandingPage = () => {
  return (
    <main className="w-full min-h-screen">
      <header className="fixed top-4 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto backdrop-blur-lg border shadow-xl rounded-xl py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 md:h-16">
            <div className="flex space-x-3 items-center">
              <span className="text-2xl font-bold bg-clip-text">DevNotify</span>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                signIn("github", {
                  callbackUrl: "/app",
                  redirect: true,
                })
              }
              className="shadow-lg bg-blue-700/90 hover:bg-blue-700/60 flex hover:shadow-xl transform hover:scale-105 cursor-pointer  transition-all duration-300"
            >
              <Github />
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-between items-center min-h-64">
            <div className="flex flex-col gap-2.5 justify-center items-start">
              <AnimatedGradientText className="text-sm border p-2.5 rounded-xl font-medium">
                Developer Tools
              </AnimatedGradientText>
              <h1 className="text-6xl font-bold">Dev Notify</h1>
              <WordRotate
                duration={1700}
                className="text-4xl font-bold"
                words={["Track.", "Notify.", "Contribute."]}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-left text-muted-foreground text-lg leading-relaxed max-w-md ml-auto mb-4">
                GitHub tracker that notifies developers about issues from
                starred and trending repos — so they stay updated and contribute
                faster.
              </p>
              <Button
                className="cursor-pointer flex"
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/app",
                    redirect: true,
                  })
                }
              >
                Sign Up With Github <Github />
              </Button>
            </div>
          </div>
          <div></div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section id="features" className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to succeed, all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Lightning Fast",
                description:
                  "Built for speed and performance with cutting-edge technology",
                icon: "⚡",
              },
              {
                title: "Secure & Reliable",
                description:
                  "Enterprise-grade security with 99.9% uptime guarantee",
                icon: "🔒",
              },
              {
                title: "24/7 Support",
                description:
                  "Our expert team is here to help you succeed around the clock",
                icon: "🚀",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-xl hover:shadow-lg transition-shadow border border-gray-700 hover:border-gray-600"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 px-6 bg-gradient-to-r from-gray-800 to-black">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of satisfied customers and transform your business
            today
          </p>
          <button className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Your Free Trial
          </button>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">Brand</div>
          <p className="text-gray-400 mb-8">
            Building the future, one step at a time
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer> */}
    </main>
  );
};
