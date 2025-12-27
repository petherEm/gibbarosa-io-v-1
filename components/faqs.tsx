"use client";
import { useState } from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const questions = [
  {
    question: "How do you authenticate items?",
    answer:
      "Every item undergoes a rigorous multi-step authentication process combining AI-powered analysis with expert verification. Our team examines materials, hardware, stitching, serial numbers, and provenance to ensure 100% authenticity.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 14-day return policy for all purchases. Items must be returned in their original condition with all tags and packaging. Once received and inspected, refunds are processed within 5-7 business days.",
  },
  {
    question: "How do you determine condition grades?",
    answer:
      "Our condition grades range from 'Like New' to 'Good'. Each item is carefully inspected and photographed to show any wear. Detailed condition notes are provided with every listing so you know exactly what to expect.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes, we partner with Klarna and Affirm to offer flexible payment options. You can split your purchase into 4 interest-free payments or choose longer-term financing for larger purchases.",
  },
  {
    question: "How can I sell my luxury items?",
    answer:
      "Selling with us is simple. Submit photos and details of your item through our website. Our team will provide a quote within 48 hours. Once accepted, we handle authentication, photography, and listing—you receive payment when your item sells.",
  },
];

export const FAQs = () => {
  return (
    <section className="py-20 md:py-32 bg-card">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-accent mb-4">
              Support
            </p>
            <Heading className="text-3xl md:text-4xl lg:text-5xl">
              Frequently Asked{" "}
              <span className="italic font-bold"> Questions</span>
            </Heading>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <Question
                key={index}
                question={question.question}
                answer={question.answer}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

const Question = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border border-border bg-background p-6 md:p-8 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg md:text-xl font-light text-foreground pr-4">
          {question}
        </h3>
        <div className="size-8 rounded-full relative bg-foreground flex items-center justify-center flex-shrink-0">
          <IconMinus
            className={cn(
              "size-4 text-background absolute transition-all duration-300",
              !open && "opacity-0 rotate-90"
            )}
          />
          <IconPlus
            className={cn(
              "size-4 text-background absolute transition-all duration-300",
              open && "opacity-0 -rotate-90"
            )}
          />
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="mt-6 text-muted-foreground font-[Inter,sans-serif] leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </button>
  );
};
