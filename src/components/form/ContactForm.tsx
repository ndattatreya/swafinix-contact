"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inter, Manrope, Urbanist, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["700"] });
const urbanist = Urbanist({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500"] });

// Define the schema using zod
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(1, "Company name is required"),
  serviceInterested: z.string().min(1, "Service is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Thank you for your message. We will get back to you soon!" });
        reset();
      } else {
        setStatus({ type: "error", message: responseData.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="text-center mb-10 sm:mb-12">
        <p className={`${inter.className} font-urbanist text-sm sm:text-base font-medium text-[#006241] tracking-wide leading-snug mb-2 uppercase`}>
          CONTACT
        </p>
        <h1 className={`${manrope.className} font-urbanist text-3xl sm:text-5xl font-bold leading-tight sm:leading-[110%] tracking-tight mb-4`}>
          Ready to Transform your IT Infrastructure?
        </h1>
        <p className={`${urbanist.className} font-manrope text-base sm:text-lg font-normal leading-relaxed text-[#666666]`}>
          User Centric Cutting Edge Technology, Ready to serve you!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className={`${poppins.className} font-manrope block text-[#333333] text-sm sm:text-base font-medium mb-2`}>First name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="font-manrope w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("firstName")}
            />
            {errors.firstName?.message && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={`${poppins.className} block text-[#333333] text-sm sm:text-base font-medium mb-2`}>Last name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="font-manrope w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("lastName")}
            />
            {errors.lastName?.message && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className={`${poppins.className} font-manrope block text-[#333333] text-sm sm:text-base font-medium mb-2`}>Email address</label>
            <input
              type="email"
              placeholder="Enter email e.g. sabs@gmail.com"
              className="font-manrope w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email")}
            />
            {errors.email?.message && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className={`${poppins.className} block text-[#333333] text-sm sm:text-base font-medium mb-2`}>Company name</label>
            <input
              type="text"
              placeholder="Enter your Company name"
              className="font-manrope w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("companyName")}
            />
            {errors.companyName?.message && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className={`${poppins.className} font-manrope block text-[#333333] text-sm sm:text-base font-medium mb-2`}>Service Interested in</label>
            <input
              type="text"
              placeholder="E.g. Software development"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("serviceInterested")}
            />
            {errors.serviceInterested?.message && <p className="text-red-500 text-sm mt-1">{errors.serviceInterested.message}</p>}
          </div>
          <div>
            <label className={`${poppins.className} font-manrope block text-[#333333] text-sm sm:text-base font-medium mb-2`}>Tell me a bit more about it</label>
            <textarea
              placeholder="Start typing here...."
              rows={4}
              className="font-manrope w-full px-4 py-3 min-h-[120px] sm:min-h-[150px] rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              {...register("message")}
            />
            {errors.message?.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>
        </div>

        {status && (
          <div
            className={`mb-4 p-4 rounded-lg text-sm ${
              status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`font-manrope bg-[#003B7E] text-white py-3 sm:py-4 px-6 rounded-lg font-medium hover:bg-[#002d61] transition-colors w-full sm:w-[60%] md:w-[40%] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
