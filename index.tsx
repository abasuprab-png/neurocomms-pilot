/**
 * NeuroComms Pilot App
 *
 * This pilot demonstrates a handful of best‑in‑class AI agents for senior
 * communications professionals in regulated industries.  Agents are
 * intentionally high‑value: they help identify a compelling narrative,
 * review compliance risks, segment audiences and extract strategic insight.
 */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// Note: We avoid external icon libraries in this pilot to keep dependencies minimal.
// Instead, we define simple emoji-based icon components. In a production build,
// you could replace these with FontAwesome or another icon set.

const NarrativeIcon = () => <span style={{ fontSize: '1.25rem' }}>✍️</span>;
const ComplianceIcon = () => <span style={{ fontSize: '1.25rem' }}>🛡️</span>;
const AudienceIcon = () => <span style={{ fontSize: '1.25rem' }}>👥</span>;
const StrategicIcon = () => <span style={{ fontSize: '1.25rem' }}>📊</span>;
const LoadingIcon = () => <span style={{ fontSize: '1.5rem' }}>⏳</span>;

// --- Dummy AI call ---
// In this pilot we don’t have access to external LLM endpoints.  Instead,
// the `callGeminiAPI` function below returns illustrative placeholder
// responses based on the prompt.  In a production system you would
// initialize an API client (e.g., Google Gemini or another model) and
// retrieve real responses.

// --- Helper: pseudo‑AI call ---
const callGeminiAPI = async (prompt: string, isJsonOutput = true) => {
  // Determine the appropriate mock response by inspecting the prompt.
  if (prompt.includes('"newsworthiness_score"')) {
    // Narrative Architect response
    return {
      newsworthiness_score: 87,
      hook: 'Robotic knee surgery delivers faster recovery and unprecedented precision',
      headlines: [
        'New Study: Robotic Knee Replacement Cuts Recovery Time in Half',
        'Robotic Precision Leads to Better Outcomes for Knee Patients',
        'Groundbreaking Trial Shows Robotics Transform Joint Surgery',
      ],
      story_outline: {
        problem: 'Conventional knee replacements often result in long recovery times and variable outcomes.',
        promise: 'A multi‑center trial demonstrates that robotic guidance improves surgical accuracy and reduces recovery time.',
        people: 'Patients, surgeons and hospital systems seeking better outcomes with fewer complications.',
        action: 'Adopt robotic systems in orthopedic practices to enhance care and participate in ongoing research.',
      },
    };
  }
  if (prompt.includes('"compliance_risks"')) {
    // Compliance Advisor response
    return {
      compliance_risks: [
        'The phrase "breakthrough therapy" implies superiority without substantiation and could violate FDA promotion rules.',
        'Stating the product will "transform" outcomes may be considered misleading under SEC disclosure standards if unproven.',
      ],
      suggested_corrections: [
        'Replace "breakthrough therapy" with "new therapy" unless you have official breakthrough designation.',
        'Use "may improve patient outcomes" instead of definitive claims about transformation.',
      ],
      plain_language_score: 78,
    };
  }
  if (prompt.includes('"stakeholder_segments"')) {
    // Audience Intelligence response
    return {
      stakeholder_segments: [
        {
          segment_name: 'Patients',
          insights: 'Desire clear explanations of benefits, risks and insurance coverage; value empathetic tone.',
        },
        {
          segment_name: 'Physicians',
          insights: 'Require clinical evidence, procedural details, and peer endorsements; prefer concise, technical communication.',
        },
        {
          segment_name: 'Regulators',
          insights: 'Focus on compliance, safety data, and adherence to reporting standards; expect formal tone.',
        },
        {
          segment_name: 'Investors',
          insights: 'Interested in market potential, competitive landscape, and financial impact; appreciate strategic vision.',
        },
      ],
      channel_recommendations: [
        'Patients: support forums, social media groups, email newsletters',
        'Physicians: CME webinars, medical journals, professional networks',
        'Regulators: official submissions, regulatory briefings, industry conferences',
        'Investors: earnings calls, investor presentations, LinkedIn',
      ],
      tone_guidelines: [
        'Patients: empathetic and reassuring',
        'Physicians: evidence‑driven and respectful of expertise',
        'Regulators: precise and compliant',
        'Investors: confident and forward‑looking',
      ],
    };
  }
  if (prompt.includes('"analysis"')) {
    // Strategic Insight response
    return {
      analysis: [
        {
          brand: 'Competitor A',
          narrative: 'Positions itself as the pioneer in digital therapeutics with a heavy focus on innovation.',
          share_of_voice: 40,
          strengths: 'Strong R&D pipeline, active thought leadership in journals.',
          weaknesses: 'Limited patient outreach and complex messaging.',
        },
        {
          brand: 'Competitor B',
          narrative: 'Emphasizes affordability and accessibility of solutions.',
          share_of_voice: 30,
          strengths: 'Aggressive marketing, strong social media presence.',
          weaknesses: 'Perceived as less advanced technologically.',
        },
      ],
      opportunity: 'Differentiate by combining innovation leadership with clear patient‑centric messaging and demonstrated real‑world outcomes.',
    };
  }
  // Fallback: return generic error when no pattern matched
  if (!isJsonOutput) {
    return 'This is a placeholder response. Provide a valid prompt to receive a structured output.';
  }
  return {};
};

// --- UI Helpers ---
const LoadingSpinner = ({ text }: { text: string }) => (
  <div style={{ textAlign: 'center', padding: '1rem' }}>
    <LoadingIcon />
    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{text}</p>
  </div>
);

const AgentCard = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      background: '#fff',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      flex: 1,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
      <div style={{ marginRight: '0.75rem', background: '#e0e7ff', padding: '0.5rem', borderRadius: '9999px' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{description}</p>
      </div>
    </div>
    {children}
  </div>
);

// --- Agent 1: Narrative Architect ---
const NarrativeArchitectAgent = () => {
  const [title, setTitle] = useState('New robotic knee replacement study');
  const [details, setDetails] = useState('We are announcing a multi‑center trial showing improved outcomes with our robotic system.');
  const [industry, setIndustry] = useState('MedTech');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!details) {
      setError('Please provide details for your announcement.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const prompt = `Act as a senior communications strategist working in a highly regulated industry (${industry}).  You are given an announcement title and details.  Your task is to identify the most newsworthy angle and craft a narrative using the NeuroComms four‑phase framework (Problem, Promise, People, Action).  First, assess the newsworthiness and assign a score from 1‑100.  Then propose a compelling hook, three optimized AP‑style headlines, and a detailed story_outline with keys for "problem", "promise", "people", and "action".  Output a JSON object with keys: "newsworthiness_score" (number), "hook" (string), "headlines" (array of strings), and "story_outline" (object).  Announcement title: "${title}".  Details: "${details}".`;
      const res = await callGeminiAPI(prompt);
      setResult(res);
    } catch (e) {
      setError('Failed to generate narrative. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement title"
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder="Describe the announcement or event..."
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        >
          <option>MedTech</option>
          <option>Pharma</option>
          <option>Healthcare</option>
          <option>Finance</option>
          <option>Legal</option>
        </select>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          style={{
            backgroundColor: '#6366f1',
            color: '#fff',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontWeight: 600,
          }}
        >
          {isLoading ? 'Crafting Narrative...' : 'Generate Narrative'}
        </button>
      </div>
      {isLoading && <LoadingSpinner text={`Analyzing announcement...`} />}
      {error && <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <p><strong>Newsworthiness Score:</strong> {result.newsworthiness_score}/100</p>
          <p><strong>Hook:</strong> {result.hook}</p>
          <div>
            <strong>Headlines:</strong>
            <ul>
              {result.headlines.map((h: string, i: number) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Story Outline:</strong>
            <ul>
              <li><strong>Problem:</strong> {result.story_outline.problem}</li>
              <li><strong>Promise:</strong> {result.story_outline.promise}</li>
              <li><strong>People:</strong> {result.story_outline.people}</li>
              <li><strong>Action:</strong> {result.story_outline.action}</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

// --- Agent 2: Compliance Advisor ---
const ComplianceAdvisorAgent = () => {
  const [text, setText] = useState('Our breakthrough therapy will transform patient outcomes and is FDA‑approved.');
  const [industry, setIndustry] = useState('Pharma');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!text) {
      setError('Please enter text for compliance review.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const prompt = `Act as a compliance advisor for the ${industry} industry.  Review the following draft communication for regulatory and ethical risks.  Identify any claims that may violate industry regulations (e.g., FDA rules for pharma/medtech, SEC rules for finance, legal advertising codes), jargon or unclear wording, and suggest clear, plain‑language corrections.  Score the overall plain‑language clarity from 1‑100.  Provide a JSON object with keys: "compliance_risks" (array of strings), "suggested_corrections" (array of strings), and "plain_language_score" (number).  Text: "${text}"`;
      const res = await callGeminiAPI(prompt);
      setResult(res);
    } catch (e) {
      setError('Failed to perform compliance review.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Paste your draft communication here..."
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        >
          <option>Pharma</option>
          <option>MedTech</option>
          <option>Healthcare</option>
          <option>Finance</option>
          <option>Legal</option>
        </select>
        <button
          onClick={handleReview}
          disabled={isLoading}
          style={{ backgroundColor: '#10b981', color: '#fff', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', fontWeight: 600 }}
        >
          {isLoading ? 'Reviewing...' : 'Review for Compliance'}
        </button>
      </div>
      {isLoading && <LoadingSpinner text={`Evaluating compliance...`} />}
      {error && <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <p><strong>Plain‑Language Score:</strong> {result.plain_language_score}/100</p>
          <div>
            <strong>Compliance Risks:</strong>
            <ul>
              {result.compliance_risks.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Suggested Corrections:</strong>
            <ul>
              {result.suggested_corrections.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

// --- Agent 3: Audience Intelligence ---
const AudienceIntelligenceAgent = () => {
  const [topic, setTopic] = useState('Wearable glucose monitor for diabetics');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!topic) {
      setError('Please provide a campaign or product topic.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const prompt = `You are an audience strategy analyst for regulated industries.  For the topic "${topic}", identify the key stakeholder segments (e.g., patients, physicians, payers, regulators, investors, general public) and provide insights about their needs, motivations, and preferred channels.  Suggest effective message tones for each segment.  Provide a JSON object with keys: "stakeholder_segments" (array of objects with "segment_name" and "insights"), "channel_recommendations" (array of strings), and "tone_guidelines" (array of strings).`;
      const res = await callGeminiAPI(prompt);
      setResult(res);
    } catch (e) {
      setError('Failed to analyze audience.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter campaign or product topic"
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', fontWeight: 600 }}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Audience'}
        </button>
      </div>
      {isLoading && <LoadingSpinner text={`Identifying segments...`} />}
      {error && <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <div>
            <strong>Stakeholder Segments & Insights:</strong>
            <ul>
              {result.stakeholder_segments.map((seg: any, i: number) => (
                <li key={i}><strong>{seg.segment_name}:</strong> {seg.insights}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Channel Recommendations:</strong>
            <ul>
              {result.channel_recommendations.map((ch: string, i: number) => (
                <li key={i}>{ch}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Tone Guidelines:</strong>
            <ul>
              {result.tone_guidelines.map((tg: string, i: number) => (
                <li key={i}>{tg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

// --- Agent 4: Strategic Insight ---
const StrategicInsightAgent = () => {
  const [competitors, setCompetitors] = useState('Competitor A, Competitor B');
  const [topic, setTopic] = useState('digital therapeutics');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInsight = async () => {
    if (!competitors || !topic) {
      setError('Please provide competitors and a topic.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const prompt = `You are an AI strategic analyst.  Compare the communications strategies of the following competitors: ${competitors}.  Focus on the topic of "${topic}" within regulated industries.  Summarize their narrative positioning, share of voice, strengths and weaknesses, and recommend a unique strategic opportunity for differentiation.  Provide a JSON object with keys: "analysis" (array of objects with "brand", "narrative", "share_of_voice", "strengths", "weaknesses"), and "opportunity" (string).`;
      const res = await callGeminiAPI(prompt);
      setResult(res);
    } catch (e) {
      setError('Failed to generate strategic insight.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
          placeholder="Enter competitor names (comma‑separated)"
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Core topic"
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
        <button
          onClick={handleInsight}
          disabled={isLoading}
          style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', fontWeight: 600 }}
        >
          {isLoading ? 'Analyzing...' : 'Generate Strategic Insight'}
        </button>
      </div>
      {isLoading && <LoadingSpinner text={`Analyzing competitors...`} />}
      {error && <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <div>
            <strong>Competitor Analysis:</strong>
            <ul>
              {result.analysis.map((item: any, i: number) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong>{item.brand}</strong> (Share of Voice: {item.share_of_voice}%):<br />
                  Narrative: {item.narrative}<br />
                  Strengths: {item.strengths}<br />
                  Weaknesses: {item.weaknesses}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Strategic Opportunity:</strong> {result.opportunity}
          </div>
        </div>
      )}
    </>
  );
};

// --- Main Application Component ---
function App() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>NeuroComms Pilot Dashboard</h1>
        <p style={{ color: '#6b7280' }}>High‑impact AI agents for communications leaders in regulated industries.</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <AgentCard
          icon={<NarrativeIcon />}
          title="Narrative Architect"
          description="Discover the hook and craft a compelling NeuroComms story."
        >
          <NarrativeArchitectAgent />
        </AgentCard>
        <AgentCard
          icon={<ComplianceIcon />}
          title="Compliance Advisor"
          description="Identify risks and translate copy into plain language."
        >
          <ComplianceAdvisorAgent />
        </AgentCard>
        <AgentCard
          icon={<AudienceIcon />}
          title="Audience Intelligence"
          description="Segment stakeholders and tailor your message."
        >
          <AudienceIntelligenceAgent />
        </AgentCard>
        <AgentCard
          icon={<StrategicIcon />}
          title="Strategic Insight"
          description="Benchmark competitors and spot your opportunity."
        >
          <StrategicInsightAgent />
        </AgentCard>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);