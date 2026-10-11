import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryData {
  geographicScope: string;
  currency: string;
  min: number;
  median: number;
  max: number;
  period: string;
  sourceName: string;
  sourceUrl: string;
  publicationYear: number;
  socCodeOrStandard: string;
}

export interface IEmploymentOutlook {
  geographicScope: string;
  growthRateText: string;
  projectedOpeningsText: string;
  sourceName: string;
  sourceUrl: string;
  publicationYear: number;
}

export interface ISampleJobPosting {
  title: string;
  companyOrType: string;
  location: string;
  isIllustrativeDemo: boolean;
  sourceNote: string;
  sampleResponsibilities: string[];
}

export interface IOfficialBody {
  name: string;
  type: string;
  url: string;
  countryOrScope: string;
}

export interface IIndustryReport {
  title: string;
  publisher: string;
  year: number;
  keyInsight: string;
  citationUrl: string;
}

export interface ICareerEvidence {
  salaryData: ISalaryData[];
  employmentOutlook: IEmploymentOutlook;
  sampleRolesOrJobPostings: ISampleJobPosting[];
  officialBodiesAndCertifications: IOfficialBody[];
  industryReports: IIndustryReport[];
  limitationsNote: string;
}

export interface IMiniProject {
  title: string;
  description: string;
  duration: string;
  type: 'mini_project' | 'intro_lesson' | 'informational_interview';
}

export interface ICareer extends Document {
  careerId: string;
  title: string;
  domain: string;
  summary: string;
  description: string;
  keyActivities: string[];
  workStyleTags: string[];
  environmentTags: string[];
  priorityTags: string[];
  educationRequirement: {
    level: string;
    typicalMajors: string[];
    willingnessMatch: string[];
  };
  transferableSubjects: string[];
  entryPathways: string[];
  tradeoffsAndUncertainties: string[];
  practicalMiniProjects: IMiniProject[];
  evidence: ICareerEvidence;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    careerId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    domain: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    keyActivities: [{ type: String }],
    workStyleTags: [{ type: String }],
    environmentTags: [{ type: String }],
    priorityTags: [{ type: String }],
    educationRequirement: {
      level: { type: String, required: true },
      typicalMajors: [{ type: String }],
      willingnessMatch: [{ type: String }],
    },
    transferableSubjects: [{ type: String }],
    entryPathways: [{ type: String }],
    tradeoffsAndUncertainties: [{ type: String }],
    practicalMiniProjects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String, required: true },
        type: {
          type: String,
          enum: ['mini_project', 'intro_lesson', 'informational_interview'],
          required: true,
        },
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: { type: String, required: true },
          currency: { type: String, required: true },
          min: { type: Number, required: true },
          median: { type: Number, required: true },
          max: { type: Number, required: true },
          period: { type: String, default: 'per year' },
          sourceName: { type: String, required: true },
          sourceUrl: { type: String, required: true },
          publicationYear: { type: Number, required: true },
          socCodeOrStandard: { type: String, default: '' },
        },
      ],
      employmentOutlook: {
        geographicScope: { type: String, required: true },
        growthRateText: { type: String, required: true },
        projectedOpeningsText: { type: String, required: true },
        sourceName: { type: String, required: true },
        sourceUrl: { type: String, required: true },
        publicationYear: { type: Number, required: true },
      },
      sampleRolesOrJobPostings: [
        {
          title: { type: String, required: true },
          companyOrType: { type: String, required: true },
          location: { type: String, required: true },
          isIllustrativeDemo: { type: Boolean, default: true },
          sourceNote: { type: String, required: true },
          sampleResponsibilities: [{ type: String }],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: { type: String, required: true },
          type: { type: String, required: true },
          url: { type: String, required: true },
          countryOrScope: { type: String, required: true },
        },
      ],
      industryReports: [
        {
          title: { type: String, required: true },
          publisher: { type: String, required: true },
          year: { type: Number, required: true },
          keyInsight: { type: String, required: true },
          citationUrl: { type: String, required: true },
        },
      ],
      limitationsNote: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Career = mongoose.model<ICareer>('Career', CareerSchema);
