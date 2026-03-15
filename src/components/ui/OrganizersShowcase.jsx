export default function OrganizersShowcase() {
  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Collaboration</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Organizing Partners</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            Meet the visionary organizations behind the Hospitality Hackathon 2025
          </p>
        </div>

                {/* ALX Ethiopia */}
                <div className="grid gap-8 md:grid-cols-2 items-center mb-16 border-b pb-16">
          <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/images/alx-hub.JPG"
              alt="ALX Ethiopia Training Session"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-800">ALX Ethiopia</h3>
            <p className="text-gray-600">
              Dedicated to unlocking human potential through world-class tech training, ALX Ethiopia provides millions
              across Africa with access to future-proof skills development. Their programs are designed to be responsive
              and agile, empowering individuals to reveal their exceptional capabilities.
            </p>
            <p className="text-gray-600">
              For the Hospitality Hackathon, ALX Ethiopia contributes their technical expertise and educational
              framework, ensuring participants have the knowledge and support to create innovative tech solutions.
            </p>
          </div>
        </div>

        {/* Kuriftu Resorts */}
        <div className="grid gap-8 md:grid-cols-2 items-center mb-16 border-b pb-16">
          <div className="relative h-[300px] md:h-[400px]  overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CfcF48zB0j2ZRmTH0mk5b9kpSQcV0l.png"
              alt="Kuriftu Resort & Spa African Village"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-800">Kuriftu Resort & Spa</h3>
            <p className="text-gray-600">
              With a devotion to connecting African nations through unique hospitality experiences, Kuriftu Resort & Spa
              showcases the beauty of Africa through their innovative African Village concept. Their 54 villas celebrate
              the individual character of each African country through food, art, cultural artifacts, and more.
            </p>
            <p className="text-gray-600">
              For the Hospitality Hackathon, Kuriftu brings their expertise in creating authentic cultural experiences
              and their vision of using hospitality as a means to showcase Ethiopia's rich heritage.
            </p>
          </div>
        </div>

        {/* WeVenture Hub */}
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="relative h-[300px] md:h-[400px]  overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/images/weventure.png"
              alt="WeVenture Hub Facility"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-800">WeVenture Hub</h3>
            <p className="text-gray-600">
              WeVenture Hub is dedicated to bringing home-grown breakthrough ideas to life by nurturing unconventional
              thinkers and promoting creative intelligence. They provide key technical and non-technical support to
              early-stage businesses solving complex societal challenges.
            </p>
            <p className="text-gray-600">
              For the Hospitality Hackathon, WeVenture Hub offers their expertise in innovation incubation and their
              network of industry leaders, entrepreneurs, and investors to help transform promising ideas into viable
              solutions for Ethiopia's hospitality sector.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

