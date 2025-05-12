import {
  AGE,
  BIRTH_DAY,
  USERNAME,
  USERNAME_LONG,
  USERNAME_SHORT,
} from "@/const";
import { Metadata } from "next";
import Logo from "@/components/logo.svg";
import PersonalityCharts from "@/app/[locale]/about/PersonalityCharts";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Locale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("aboutTitle", {
      username: USERNAME_SHORT,
    }),
    description: t("aboutDescription", {
      username: USERNAME,
    }),
  };
}

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <main className="container flex flex-col py-8 gap-12">
      <section className="flex flex-col items-center text-center gap-8 py-8 px-4 md:py-20 md:px-12 md:gap-12">
        <h1 className="text-5xl font-bold">
          {t.rich("message", {
            br: () => <br />,
            name: USERNAME_LONG,
          })}
        </h1>

        <div className="flex items-center justify-center flex-wrap gap-2">
          <Link href="#profile">
            <Button size="xl" variant="outline">
              Profile
              <ArrowRight />
            </Button>
          </Link>

          <Link href="#personality">
            <Button size="xl" variant="outline">
              Personality
              <ArrowRight />
            </Button>
          </Link>

          <Link href="#vision">
            <Button size="xl" variant="outline">
              Vision
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </section>

      <section id="whoami" className="flex flex-col gap-8 px-4 pb-8 border-b">
        <h2 className="text-2xl font-bold">Profile</h2>

        <div className="flex flex-col items-center gap-6 md:gap-12 md:flex-row md:items-start">
          <div className="flex items-center justify-center size-44 rounded-lg bg-stone-400 dark:bg-stone-700">
            <Logo className="size-32" fill="currentColor" />
          </div>

          <div className="flex w-full flex-col gap-2 md:flex-1">
            <h3 className="text-xl font-semibold text-center md:text-left">
              {USERNAME_LONG} ({USERNAME})
            </h3>

            <div className="flex flex-col gap-2 md:gap-12 md:flex-row whitespace-pre-wrap">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Name</p>
                  <p>{t("realName")}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Birthday (Age)</p>
                  <p>
                    {BIRTH_DAY.toLocaleDateString()} ({AGE})
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Birthplace</p>
                  <p>{t("birthplace")}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Job</p>
                  <p>{t("job")}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Skills</p>
                  <p>
                    {t.rich("skills", {
                      strong: (c) => <span className="font-medium">{c}</span>,
                      br: () => <br />,
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Academic Background</p>
                  <p>{t("academicQualification")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="personality"
        className="flex flex-col gap-8 px-4 pb-6 border-b"
      >
        <h2 className="text-2xl font-bold">Personality</h2>

        <div className="flex flex-col bg-secondary p-6 rounded-lg shadow gap-2">
          {t.rich("personalitySummary", {
            strong: (c) => <strong>{c}</strong>,
            p: (c) => <p>{c}</p>,
            ul: (c) => (
              <ul className="flex flex-col list-disc list-inside gap-1">{c}</ul>
            ),
            li: (c) => <li>{c}</li>,
            br: () => <br />,
          })}
        </div>

        <PersonalityCharts />
      </section>

      <section id="vision" className="flex flex-col gap-8 px-4 pb-8 border-b">
        <h2 className="text-2xl font-bold">Vision to 2035</h2>

        {/* Overview */}
        <p>
          {t.rich("visionOverview", {
            strong: (c) => <strong>{c}</strong>,
            br: () => <br />,
          })}
        </p>

        {/* Phases */}
        <div className="flex flex-col gap-6">
          {t.rich("visionPhases", {
            container: (c) => (
              <div className="bg-secondary p-6 rounded-lg shadow flex flex-col gap-2">
                {c}
              </div>
            ),
            h3: (c) => <h3 className="font-semibold">{c}</h3>,
            muted: (c) => (
              <span className="text-muted-foreground text-sm">{c}</span>
            ),
            ul: (c) => (
              <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
                {c}
              </ul>
            ),
            li: (c) => <li>{c}</li>,
          })}
        </div>
      </section>
    </main>
  );
}
