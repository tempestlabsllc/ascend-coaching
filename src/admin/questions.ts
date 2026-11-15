// The exact questions from the intake questionnaire (src/app/intake/IntakeForm.tsx) and
// the weekly check-in (src/app/check-in/CheckInForm.tsx), in the order clients see them.
// Admin uses this to show each answer under its question. Keep in sync if a form changes.
export type QSection = { title: string; questions: [name: string, question: string][] };

export const intakeQuestions: QSection[] = [
  { title: "About you", questions: [
    ["name", "Full name"],
    ["phone", "Phone / WhatsApp number (with country code)"],
    ["email", "Email"],
    ["age", "Age"],
    ["sex", "Sex"],
    ["units", "Units"],
    ["height", "Height"],
    ["currentWeight", "Current weight"],
    ["goalWeight", "Goal weight (optional)"],
    ["bodyFat", "Estimated body fat % (optional)"],
  ] },
  { title: "Goals", questions: [
    ["goals", "What are your main goals?"],
    ["goalDetail", "Describe your goal in your own words"],
    ["timeline", "Timeline"],
    ["motivation", "Motivation level (1–10)"],
    ["why", "Why now? What's driving you?"],
  ] },
  { title: "Training", questions: [
    ["experience", "Training experience"],
    ["daysPerWeek", "Days per week you can train"],
    ["equipment", "Where will you train?"],
    ["sessionLength", "Session length"],
    ["currentTraining", "What does your current training look like?"],
  ] },
  { title: "Nutrition & lifestyle", questions: [
    ["activity", "Daily activity (outside training)"],
    ["sleep", "Average sleep"],
    ["stress", "Stress level"],
    ["mealsPerDay", "Meals per day"],
    ["diet", "Dietary preferences, allergies or foods you avoid"],
    ["typicalDay", "What does a typical day of eating look like?"],
  ] },
  { title: "Health", questions: [
    ["health", "Injuries, medical conditions, or medications I should know about"],
    ["referral", "How did you hear about me?"],
    ["waiver", "Health waiver and Terms of Service"],
  ] },
];

export const checkInQuestions: QSection[] = [
  { title: "Check-in", questions: [
    ["name", "Full name"],
    ["email", "Email"],
    ["weight", "Current weight"],
    ["waist", "Waist measurement (optional)"],
    ["workouts", "Workouts completed vs planned"],
    ["nutrition", "Nutrition: how well you hit your targets (1–10)"],
    ["sleep", "Sleep quality (1–10)"],
    ["energy", "Energy (1–10)"],
    ["stress", "Stress, 10 = very stressed (1–10)"],
    ["win", "Biggest win this week"],
    ["struggle", "Biggest struggle"],
    ["questions", "Questions for your coach"],
  ] },
];
