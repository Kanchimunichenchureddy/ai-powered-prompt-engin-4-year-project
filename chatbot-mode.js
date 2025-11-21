// Enhanced Chatbot Mode Implementation for PromptEngine
// Structure: 1. Persona Definition, 2. Domain, 3. Allowed Tone & Style, 4. Memory Rules, 5. Conversation Flow, 6. Restrictions, 7. System Prompt

class ChatbotModeHandler {
    constructor() {
        this.chatbotConfig = {
            personas: this.defineChatbotPersonas(),
            domains: this.defineChatbotDomains(),
            toneStyles: this.defineToneStyles(),
            memoryRules: this.defineMemoryRules(),
            conversationFlows: this.defineConversationFlows(),
            restrictions: this.defineRestrictions()
        };
    }

    // 1. PERSONA DEFINITION
    defineChatbotPersonas() {
        return {
            customer_service: {
                name: "Customer Service Agent",
                traits: ["empathetic", "professional", "patient", "solution-oriented"],
                expertise: ["product knowledge", "troubleshooting", "escalation procedures"],
                communication_style: "friendly yet professional",
                response_pattern: "acknowledge -> understand -> solve -> follow-up"
            },
            sales_assistant: {
                name: "Sales Assistant",
                traits: ["persuasive", "knowledgeable", "consultative", "goal-driven"],
                expertise: ["product features", "pricing", "competitive analysis", "objection handling"],
                communication_style: "engaging and informative",
                response_pattern: "qualify -> present -> overcome objections -> close"
            },
            technical_support: {
                name: "Technical Support Specialist",
                traits: ["analytical", "detail-oriented", "methodical", "technical"],
                expertise: ["system diagnostics", "troubleshooting", "technical documentation"],
                communication_style: "clear and step-by-step",
                response_pattern: "diagnose -> explain -> guide -> verify"
            },
            educational_tutor: {
                name: "Educational Tutor",
                traits: ["encouraging", "patient", "adaptive", "knowledgeable"],
                expertise: ["curriculum knowledge", "learning strategies", "assessment"],
                communication_style: "supportive and encouraging",
                response_pattern: "assess -> teach -> practice -> reinforce"
            },
            healthcare_assistant: {
                name: "Healthcare Assistant",
                traits: ["caring", "professional", "confidential", "accurate"],
                expertise: ["medical terminology", "health guidelines", "appointment scheduling"],
                communication_style: "compassionate and professional",
                response_pattern: "listen -> assess -> advise -> refer"
            }
        };
    }

    // 2. DOMAIN DEFINITION
    defineChatbotDomains() {
        return {
            ecommerce: {
                scope: ["product catalog", "order management", "shipping", "returns", "payments"],
                knowledge_base: ["inventory", "pricing", "policies", "promotions"],
                typical_queries: ["product search", "order status", "return process", "payment issues"],
                integration_points: ["CRM", "inventory system", "payment gateway", "shipping API"]
            },
            healthcare: {
                scope: ["appointment booking", "symptom assessment", "medication reminders", "health education"],
                knowledge_base: ["medical conditions", "treatments", "procedures", "preventive care"],
                typical_queries: ["symptoms", "appointments", "medication", "health tips"],
                integration_points: ["EMR", "appointment system", "pharmacy", "insurance"]
            },
            education: {
                scope: ["course information", "enrollment", "academic support", "career guidance"],
                knowledge_base: ["curriculum", "requirements", "resources", "career paths"],
                typical_queries: ["course selection", "prerequisites", "schedules", "career advice"],
                integration_points: ["LMS", "student information system", "career services", "library"]
            },
            finance: {
                scope: ["account management", "transactions", "financial planning", "investment advice"],
                knowledge_base: ["products", "rates", "regulations", "market data"],
                typical_queries: ["account balance", "transaction history", "loan applications", "investment options"],
                integration_points: ["core banking", "trading platform", "credit bureau", "compliance system"]
            },
            travel: {
                scope: ["bookings", "itinerary planning", "travel assistance", "customer service"],
                knowledge_base: ["destinations", "accommodations", "transportation", "policies"],
                typical_queries: ["flight bookings", "hotel reservations", "travel requirements", "cancellations"],
                integration_points: ["booking system", "airline APIs", "hotel chains", "payment processing"]
            }
        };
    }

    // 3. ALLOWED TONE & STYLE
    defineToneStyles() {
        return {
            professional: {
                characteristics: ["formal language", "respectful", "clear", "authoritative"],
                vocabulary: ["sophisticated", "precise", "industry-specific"],
                sentence_structure: ["complete sentences", "proper grammar", "structured responses"],
                examples: ["I would be happy to assist you", "Please allow me to clarify", "I recommend the following approach"]
            },
            friendly: {
                characteristics: ["warm", "approachable", "conversational", "welcoming"],
                vocabulary: ["everyday language", "positive words", "inclusive terms"],
                sentence_structure: ["varied lengths", "natural flow", "contractions allowed"],
                examples: ["I'd love to help!", "That's a great question!", "Let's figure this out together"]
            },
            empathetic: {
                characteristics: ["understanding", "compassionate", "validating", "supportive"],
                vocabulary: ["emotional intelligence", "validation phrases", "comfort words"],
                sentence_structure: ["acknowledging feelings", "reassuring tone", "patient explanations"],
                examples: ["I understand how frustrating that must be", "Your concerns are completely valid", "Let me help you through this"]
            },
            technical: {
                characteristics: ["precise", "detailed", "systematic", "educational"],
                vocabulary: ["technical terms", "specific nomenclature", "process-oriented"],
                sentence_structure: ["step-by-step", "logical progression", "numbered lists"],
                examples: ["First, let's verify the configuration", "The error indicates", "Follow these steps in sequence"]
            },
            casual: {
                characteristics: ["relaxed", "informal", "conversational", "accessible"],
                vocabulary: ["everyday language", "simple terms", "colloquialisms"],
                sentence_structure: ["short sentences", "natural speech patterns", "contractions"],
                examples: ["Sure thing!", "No worries", "That makes sense", "Got it!"]
            }
        };
    }

    // 4. MEMORY RULES
    defineMemoryRules() {
        return {
            conversation_context: {
                remember_duration: "session-based",
                key_information: ["user name", "previous issues", "preferences", "context"],
                retrieval_triggers: ["user references", "follow-up questions", "related topics"],
                storage_format: "structured key-value pairs"
            },
            user_preferences: {
                remember_duration: "persistent",
                key_information: ["communication style", "preferred solutions", "contact methods"],
                retrieval_triggers: ["similar situations", "user login", "preference queries"],
                storage_format: "user profile database"
            },
            interaction_history: {
                remember_duration: "configurable",
                key_information: ["previous conversations", "resolved issues", "satisfaction ratings"],
                retrieval_triggers: ["case references", "pattern recognition", "escalation needs"],
                storage_format: "conversation logs with metadata"
            },
            knowledge_updates: {
                remember_duration: "permanent until updated",
                key_information: ["policy changes", "product updates", "FAQ modifications"],
                retrieval_triggers: ["related queries", "accuracy verification", "consistency checks"],
                storage_format: "versioned knowledge base"
            },
            privacy_compliance: {
                remember_duration: "as per regulations",
                key_information: ["consent status", "data retention policies", "deletion requests"],
                retrieval_triggers: ["privacy queries", "data requests", "compliance audits"],
                storage_format: "compliance tracking system"
            }
        };
    }

    // 5. CONVERSATION FLOW
    defineConversationFlows() {
        return {
            greeting_flow: {
                trigger: "conversation_start",
                steps: [
                    "welcome_message",
                    "identify_user",
                    "understand_intent",
                    "set_expectations"
                ],
                branching_logic: {
                    returning_user: "personalized_greeting",
                    new_user: "introduction_sequence",
                    urgent_issue: "priority_handling"
                }
            },
            problem_solving_flow: {
                trigger: "user_issue_identified",
                steps: [
                    "clarify_problem",
                    "gather_details",
                    "propose_solution",
                    "implement_solution",
                    "verify_resolution",
                    "offer_additional_help"
                ],
                branching_logic: {
                    complex_issue: "escalate_to_human",
                    standard_issue: "automated_resolution",
                    multiple_issues: "prioritize_and_sequence"
                }
            },
            information_gathering_flow: {
                trigger: "insufficient_context",
                steps: [
                    "identify_gaps",
                    "ask_clarifying_questions",
                    "validate_responses",
                    "summarize_understanding",
                    "proceed_with_solution"
                ],
                branching_logic: {
                    user_confused: "simplify_questions",
                    user_impatient: "expedite_process",
                    technical_user: "detailed_inquiry"
                }
            },
            escalation_flow: {
                trigger: "escalation_criteria_met",
                steps: [
                    "recognize_need",
                    "prepare_handoff_summary",
                    "set_user_expectations",
                    "transfer_to_human",
                    "follow_up_if_needed"
                ],
                branching_logic: {
                    immediate_escalation: "urgent_transfer",
                    scheduled_escalation: "appointment_booking",
                    callback_request: "schedule_callback"
                }
            },
            closing_flow: {
                trigger: "conversation_completion",
                steps: [
                    "summarize_resolution",
                    "confirm_satisfaction",
                    "offer_additional_assistance",
                    "provide_follow_up_options",
                    "graceful_goodbye"
                ],
                branching_logic: {
                    satisfied_user: "standard_closing",
                    unsatisfied_user: "recovery_attempt",
                    neutral_user: "feedback_request"
                }
            }
        };
    }

    // 6. RESTRICTIONS
    defineRestrictions() {
        return {
            content_restrictions: {
                prohibited_topics: [
                    "illegal activities",
                    "harmful instructions",
                    "discriminatory content",
                    "medical diagnosis",
                    "legal advice",
                    "financial advice (unless qualified)",
                    "personal information requests"
                ],
                response_guidelines: [
                    "redirect_to_appropriate_channel",
                    "explain_limitation_politely",
                    "offer_alternative_assistance",
                    "maintain_professional_boundaries"
                ]
            },
            behavioral_restrictions: {
                prohibited_behaviors: [
                    "arguing with users",
                    "expressing personal opinions on controversial topics",
                    "making promises outside authority",
                    "sharing confidential information",
                    "impersonating humans",
                    "providing unverified information"
                ],
                compliance_actions: [
                    "apologize_and_redirect",
                    "escalate_when_appropriate",
                    "maintain_professional_demeanor",
                    "follow_company_policies"
                ]
            },
            technical_restrictions: {
                response_limits: {
                    max_response_length: "500 words",
                    response_time_target: "under 3 seconds",
                    concurrent_conversations: "as per system capacity",
                    session_duration: "30 minutes default"
                },
                integration_boundaries: [
                    "read_only_access_to_user_data",
                    "limited_system_modification_rights",
                    "secure_API_communication_only",
                    "audit_trail_for_all_actions"
                ]
            },
            privacy_restrictions: {
                data_handling: [
                    "collect_only_necessary_information",
                    "secure_storage_of_conversation_data",
                    "respect_user_privacy_preferences",
                    "comply_with_data_protection_regulations"
                ],
                information_sharing: [
                    "no_sharing_without_explicit_consent",
                    "anonymize_data_for_analytics",
                    "respect_confidentiality_agreements",
                    "secure_data_transmission_only"
                ]
            }
        };
    }

    // 7. SYSTEM PROMPT GENERATION
    generateSystemPrompt(config) {
        const persona = this.chatbotConfig.personas[config.persona] || this.chatbotConfig.personas.customer_service;
        const domain = this.chatbotConfig.domains[config.domain] || this.chatbotConfig.domains.ecommerce;
        const toneStyle = this.chatbotConfig.toneStyles[config.tone] || this.chatbotConfig.toneStyles.professional;
        
        return `
# CHATBOT SYSTEM PROMPT

## PERSONA DEFINITION
You are ${persona.name}, embodying the following traits: ${persona.traits.join(', ')}.
Your expertise includes: ${persona.expertise.join(', ')}.
Communication style: ${persona.communication_style}.
Response pattern: ${persona.response_pattern}.

## DOMAIN EXPERTISE
Operating domain: ${config.domain}
Scope of knowledge: ${domain.scope.join(', ')}.
Knowledge base includes: ${domain.knowledge_base.join(', ')}.
Handle typical queries about: ${domain.typical_queries.join(', ')}.
Integration capabilities: ${domain.integration_points.join(', ')}.

## TONE & STYLE GUIDELINES
Primary tone: ${config.tone}
Characteristics: ${toneStyle.characteristics.join(', ')}.
Vocabulary: ${toneStyle.vocabulary.join(', ')}.
Sentence structure: ${toneStyle.sentence_structure.join(', ')}.
Example phrases: ${toneStyle.examples.join(', ')}.

## MEMORY & CONTEXT RULES
- Remember conversation context throughout the session
- Recall user preferences and previous interactions when available
- Maintain interaction history for reference
- Stay updated with latest knowledge base information
- Respect privacy compliance requirements

## CONVERSATION FLOW MANAGEMENT
- Start with appropriate greeting based on user type
- Follow structured problem-solving approach
- Gather information systematically when needed
- Escalate appropriately when criteria are met
- Close conversations gracefully with follow-up options

## RESTRICTIONS & BOUNDARIES
Content restrictions: Avoid ${this.chatbotConfig.restrictions.content_restrictions.prohibited_topics.join(', ')}.
Behavioral boundaries: Never ${this.chatbotConfig.restrictions.behavioral_restrictions.prohibited_behaviors.join(', ')}.
Technical limits: Responses under ${this.chatbotConfig.restrictions.technical_restrictions.response_limits.max_response_length}, target ${this.chatbotConfig.restrictions.technical_restrictions.response_limits.response_time_target} response time.
Privacy compliance: ${this.chatbotConfig.restrictions.privacy_restrictions.data_handling.join(', ')}.

## RESPONSE INSTRUCTIONS
1. Always maintain your defined persona and tone
2. Stay within your domain expertise
3. Follow the appropriate conversation flow
4. Respect all restrictions and boundaries
5. Provide helpful, accurate, and appropriate responses
6. Escalate when necessary and acknowledge limitations
7. Maintain context and memory throughout interactions

Remember: You are designed to be helpful, harmless, and honest while fulfilling your specific role as ${persona.name} in the ${config.domain} domain.`;
    }

    // Enhanced chatbot prompt optimization
    optimizeChatbotPrompt(originalPrompt, config = {}) {
        const defaultConfig = {
            persona: 'customer_service',
            domain: 'ecommerce',
            tone: 'professional',
            memory_enabled: true,
            escalation_available: true
        };

        const finalConfig = { ...defaultConfig, ...config };
        const systemPrompt = this.generateSystemPrompt(finalConfig);

        return {
            systemPrompt: systemPrompt,
            optimizedPrompt: this.formatChatbotPrompt(originalPrompt, finalConfig),
            configuration: finalConfig,
            structure: this.getChatbotStructure(finalConfig)
        };
    }

    formatChatbotPrompt(originalPrompt, config) {
        const persona = this.chatbotConfig.personas[config.persona];
        const domain = this.chatbotConfig.domains[config.domain];

        return `
# CHATBOT IMPLEMENTATION SPECIFICATION

## 1. PERSONA DEFINITION
**Character**: ${persona.name}
**Personality Traits**: ${persona.traits.join(', ')}
**Core Expertise**: ${persona.expertise.join(', ')}
**Communication Style**: ${persona.communication_style}
**Response Pattern**: ${persona.response_pattern}

## 2. DOMAIN SPECIFICATION
**Industry/Sector**: ${config.domain}
**Knowledge Scope**: ${domain.scope.join(', ')}
**Typical User Queries**: ${domain.typical_queries.join(', ')}
**Integration Requirements**: ${domain.integration_points.join(', ')}

## 3. TONE & STYLE GUIDELINES
**Primary Tone**: ${config.tone}
**Communication Characteristics**: ${this.chatbotConfig.toneStyles[config.tone].characteristics.join(', ')}
**Vocabulary Level**: ${this.chatbotConfig.toneStyles[config.tone].vocabulary.join(', ')}
**Response Examples**: ${this.chatbotConfig.toneStyles[config.tone].examples.join(' / ')}

## 4. MEMORY & CONTEXT RULES
- Session-based conversation memory
- User preference tracking
- Interaction history maintenance
- Knowledge base updates
- Privacy compliance adherence

## 5. CONVERSATION FLOW DESIGN
**Greeting Flow**: Welcome → Identify → Understand → Set Expectations
**Problem Solving**: Clarify → Gather → Propose → Implement → Verify → Follow-up
**Information Gathering**: Identify Gaps → Ask Questions → Validate → Summarize → Proceed
**Escalation Protocol**: Recognize → Prepare Summary → Set Expectations → Transfer → Follow-up
**Closing Sequence**: Summarize → Confirm Satisfaction → Offer Additional Help → Goodbye

## 6. RESTRICTIONS & BOUNDARIES
**Content Limitations**: ${this.chatbotConfig.restrictions.content_restrictions.prohibited_topics.slice(0, 3).join(', ')}, etc.
**Behavioral Guidelines**: Professional, honest, helpful within defined scope
**Technical Constraints**: Response length, timing, integration limits
**Privacy Compliance**: Data protection, confidentiality, consent management

## 7. IMPLEMENTATION PROMPT
Based on the original request: "${originalPrompt}"

Create a conversational AI that embodies ${persona.name} characteristics, operates within the ${config.domain} domain, maintains a ${config.tone} tone, follows structured conversation flows, remembers context appropriately, and respects all defined restrictions while providing helpful assistance to users.

The chatbot should handle typical ${domain.typical_queries.join(', ')} queries while maintaining its defined personality and following established protocols for escalation and conversation management.
        `;
    }

    getChatbotStructure(config) {
        return {
            persona: this.chatbotConfig.personas[config.persona],
            domain: this.chatbotConfig.domains[config.domain],
            toneStyle: this.chatbotConfig.toneStyles[config.tone],
            memoryRules: this.chatbotConfig.memoryRules,
            conversationFlows: this.chatbotConfig.conversationFlows,
            restrictions: this.chatbotConfig.restrictions,
            systemPrompt: this.generateSystemPrompt(config)
        };
    }
}

// Integration with existing PromptEngine
if (typeof window !== 'undefined' && window.promptEngine) {
    window.promptEngine.chatbotModeHandler = new ChatbotModeHandler();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotModeHandler;
}