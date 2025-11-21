#!/usr/bin/env python3
"""
PromptEngine Enhanced Gemini Service - Quick Test Script
Tests all enhanced features without needing to run the full backend
"""

import sys
sys.path.insert(0, '/c/Users/teja.kanchi/Downloads/ai promp Engin kemi k2/backend')

from gemini_service import GeminiService

def print_header(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def print_section(title):
    print(f"\n{title}")
    print("-" * 70)

# Initialize service
gemini = GeminiService()

# Test 1: Craft Prompt (all modes)
print_header("TEST 1: CRAFT STRUCTURED PROMPTS")

modes = ["ai-dev", "image-gen", "chatbot", "data-analysis"]
for mode in modes:
    print_section(f"Mode: {mode.upper()}")
    prompt = f"Sample {mode} task"
    structured = gemini.craft_prompt(prompt, mode)
    print(f"System Role: {structured['system_role'][:80]}...")
    print(f"Constraints (first 100 chars): {structured['constraints'][:100]}...")
    print(f"Full prompt length: {len(structured['full'])} characters")

# Test 2: Quality Scoring
print_header("TEST 2: QUALITY SCORING (6 DIMENSIONS)")

test_prompts = [
    "Create a function",  # Poor prompt
    "Create a Python function that validates email addresses",  # Better
    "Create a comprehensive, production-ready Python function that validates email addresses using regex patterns, handles all edge cases including international formats, returns a boolean, includes comprehensive unit tests with 10+ test cases covering normal and edge cases, follows PEP8 standards, includes detailed documentation, and is optimized for performance."  # Excellent
]

for i, prompt in enumerate(test_prompts, 1):
    print_section(f"Prompt {i}: '{prompt[:50]}...'")
    scores = gemini.generate_quality_scores(prompt)
    
    print("✓ Quality Scores:")
    print(f"  • Clarity:       {scores['clarity']:.1f}/10")
    print(f"  • Specificity:   {scores['specificity']:.1f}/10")
    print(f"  • Completeness:  {scores['completeness']:.1f}/10")
    print(f"  • Technical:     {scores['technical']:.1f}/10")
    print(f"  • Structure:     {scores['structure']:.1f}/10")
    print(f"  • Practicality:  {scores['practicality']:.1f}/10")
    print(f"  ─────────────────────────")
    print(f"  📊 OVERALL:     {scores['overall']:.1f}/10")
    
    print("\n✓ Metadata:")
    meta = scores['metadata']
    print(f"  • Word count: {meta['word_count']}")
    print(f"  • Sentence count: {meta['sentence_count']}")
    print(f"  • Paragraph count: {meta['paragraph_count']}")
    print(f"  • Action verbs: {meta['action_verbs']}")
    print(f"  • Specific terms: {meta['specific_terms']}")
    print(f"  • Technical terms: {meta['technical_terms']}")
    print(f"  • Requirements indicators: {meta['requirements_indicators']}")

# Test 3: Fallback Optimization (different modes)
print_header("TEST 3: PROMPT OPTIMIZATION (FALLBACK MODE)")

test_cases = [
    ("Build a REST API for user management", "ai-dev", {"include_tests": True, "add_documentation": True, "performance_optimization": True, "security_features": True}),
    ("Design a modern website banner", "image-gen", {}),
    ("Create a customer support chatbot", "chatbot", {}),
    ("Analyze sales trends", "data-analysis", {})
]

for original, mode, options in test_cases:
    print_section(f"Mode: {mode} | Prompt: '{original}'")
    optimized = gemini.optimize_prompt(original, mode, options)
    
    # Show first 300 chars of optimization
    print(f"Optimized prompt (first 300 chars):\n")
    print(optimized[:300] + "...\n")
    print(f"Total length: {len(optimized)} characters")
    print(f"Sections: {len([line for line in optimized.split('\\n') if line.startswith(('📋', '🎯', '🏗️', '📝', '🧪', '🚀', '💡', '⚠️'))])}")

# Test 4: Assistant Responses
print_header("TEST 4: CONTEXT-AWARE ASSISTANT RESPONSES")

questions = [
    ("How do I improve my AI development prompts?", "ai-dev"),
    ("What makes a good image generation prompt?", "image-gen"),
    ("How should I structure a chatbot prompt?", "chatbot"),
    ("What's important in a data analysis prompt?", "data-analysis"),
]

for question, context in questions:
    print_section(f"Q: {question} (Context: {context})")
    response = gemini.generate_assistant_response(question, context)
    # Show first 250 chars
    print(response[:250] + "...\n")
    print(f"Response length: {len(response)} characters")

# Test 5: Summary Statistics
print_header("SUMMARY")

print("""
✅ ALL TESTS COMPLETED

Enhanced Features Tested:
✓ Structured prompt crafting for 4 modes
✓ 6-dimensional quality scoring with metadata
✓ Comprehensive prompt optimization (fallback mode)
✓ Context-aware assistant responses

Quality Scoring Dimensions:
  1. Clarity - How understandable
  2. Specificity - How detailed
  3. Completeness - How well-structured
  4. Technical - Technical depth
  5. Structure - Organization & formatting
  6. Practicality - How implementable

Metadata Tracked:
  • Word/sentence/paragraph counts
  • Action verb count
  • Specific term indicators
  • Technical term indicators
  • Requirements indicator count

Mode Support:
  ✓ ai-dev - Development & coding
  ✓ image-gen - Image generation
  ✓ chatbot - Conversational AI
  ✓ data-analysis - Data science

Next Steps:
1. Start backend: cd backend && python main.py
2. Visit: http://127.0.0.1:8080
3. Enter a prompt and test the enhanced service
4. Check database for saved optimizations
5. Review quality scores and recommendations
""")

print("\n" + "=" * 70)
print("  Test Complete! Service is Ready")
print("=" * 70 + "\n")
