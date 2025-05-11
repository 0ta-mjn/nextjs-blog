"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PersonalityCharts() {
  const t = useTranslations("About");
  const bigFiveData = useMemo<PersonalityData[]>(
    () => [
      { trait: t("neuroticism"), score: 73 },
      { trait: t("extraversion"), score: 54 },
      { trait: t("openness"), score: 88 },
      { trait: t("agreeableness"), score: 68 },
      { trait: t("conscientiousness"), score: 71 },
    ],
    [t]
  );
  const interestData = useMemo<PersonalityData[]>(
    () => [
      { trait: t("realistic"), score: 18 },
      { trait: t("investigative"), score: 22 },
      { trait: t("artistic"), score: 12 },
      { trait: t("social"), score: 12 },
      { trait: t("enterprising"), score: 7 },
      { trait: t("conventional"), score: 10 },
    ],
    [t]
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 md:gap-12 md:flex-row">
      <div className="flex flex-col items-center flex-1">
        <h3 className="font-semibold text-center">
          Big Five Personality Traits
        </h3>

        <div className="flex h-80 w-full items-center justify-center text-cyan-700 dark:text-cyan-300">
          <PersonalityRadarChart data={bigFiveData} max={100} />
        </div>
      </div>

      <div className="flex flex-col items-center flex-1">
        <h3 className="font-semibold text-center">SWOT Analysis</h3>

        <div className="flex h-80 w-full items-center justify-center">
          <div className="grid grid-cols-2 grid-rows-2 w-full gap-2">
            <Quadrant
              title={t("strength")}
              items={t.rich("swotStrengths", {
                li: (children) => <li>{children}</li>,
              })}
              className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-600"
            />
            <Quadrant
              title={t("weakness")}
              items={t.rich("swotWeaknesses", {
                li: (children) => <li>{children}</li>,
              })}
              className="bg-rose-50 dark:bg-rose-900/20 border-rose-600"
            />
            <Quadrant
              title={t("opportunity")}
              items={t.rich("swotOpportunities", {
                li: (children) => <li>{children}</li>,
              })}
              className="bg-sky-50 dark:bg-sky-900/20 border-sky-600"
            />
            <Quadrant
              title={t("threat")}
              items={t.rich("swotThreats", {
                li: (children) => <li>{children}</li>,
              })}
              className="bg-amber-50 dark:bg-amber-900/20 border-amber-600"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center flex-1">
        <h3 className="font-semibold text-center">O*NET Interest Profiler</h3>

        <div className="flex h-80 w-full items-center justify-center text-orange-700 dark:text-orange-300">
          <PersonalityRadarChart data={interestData} max={30} />
        </div>
      </div>
    </div>
  );
}

/**
 * Represents a single Personality trait datum.
 */
interface PersonalityData {
  trait: string;
  score: number;
}

/**
 * Component props.
 * @param data — Optional custom dataset. Defaults to the user's scores.
 * @param max  — Maximum scale for the radius axis (default 40).
 */
interface PersonalityRadarChartProps {
  data: PersonalityData[];
  max: number;
}

/**
 * Personality RadarChart component.
 * Fully responsive & supports dark‑mode via `currentColor`.
 */
const PersonalityRadarChart = ({ data, max }: PersonalityRadarChartProps) => {
  return (
    <ResponsiveContainer minWidth="100%" height="100%">
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis dataKey="trait" tick={RadarAngleTick} />
        <PolarRadiusAxis angle={90} domain={[0, max]} tick={false} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="currentColor"
          fill="currentColor"
          fillOpacity={0.4}
        />
        <Tooltip wrapperStyle={{ color: "#0c0a09" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const RadarAngleTick = ({
  payload,
  x,
  y,
  cx,
  cy,
  ...rest
}: {
  payload: { value: string };
  x: number;
  y: number;
  cx: number;
  cy: number;
  fontSize?: number;
  factor?: number;
} & React.SVGProps<SVGTextElement>) => {
  const dx = x - cx;
  const dy = y - cy;
  return (
    <text
      {...rest}
      x={cx + dx * 1.1}
      y={cy + dy * 1.1}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fill="currentColor"
      className="text-foreground"
    >
      {payload.value}
    </text>
  );
};

interface QuadrantProps {
  title: string;
  items: React.ReactNode;
  className: string;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, items, className }) => (
  <div className={`border rounded-lg p-4 flex gap-2 flex-col ${className}`}>
    <p className="font-semibold text-base">{title}</p>
    <ul className="flex flex-col gap-1 text-sm">{items}</ul>
  </div>
);
