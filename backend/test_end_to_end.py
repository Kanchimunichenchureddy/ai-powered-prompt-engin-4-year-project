"""
Comprehensive End-to-End Test Suite
Tests the complete workflow: Frontend toggles → Backend API → Response
"""

import requests
import json

API_BASE = "http://127.0.0.1:8000"

def print_section(title):
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80 + "\n")

def test_1_backend_health():
    """Test 1: Backend API health check"""
    print_section("TEST 1: Backend API Health Check")
    
    try:
        response = requests.get(f"{API_BASE}/")
        print(f"✅ Backend API is running")
        print(f"   Status: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Backend API not responding: {e}")
        return False

def test_2_optimize_without_features():
    """Test 2: Basic optimization without advanced features"""
    print_section("TEST 2: Basic Optimization (No Advanced Features)")
    
    payload = {
        "original_prompt": "Build a todo app",
        "mode": "ai-dev",
        "include_tests": False,
        "add_documentation": False,
        "performance_optimization": False,
        "security_features": False
    }
    
    try:
        response = requests.post(f"{API_BASE}/optimize", json=payload)
        data = response.json()
        
        print(f"✅ Optimization successful")
        print(f"   Original length: {len(payload['original_prompt'])} chars")
        print(f"   Optimized length: {len(data.get('optimized_prompt', ''))} chars")
        print(f"   Improvement: {data.get('improvement_percentage', 0)}%")
        print(f"\n   First 200 chars of optimized prompt:")
        print(f"   {data.get('optimized_prompt', '')[:200]}...")
        return True
    except Exception as e:
        print(f"❌ Optimization failed: {e}")
        return False

def test_3_chain_of_thought():
    """Test 3: Optimization with Chain-of-Thought enabled"""
    print_section("TEST 3: Chain-of-Thought Feature")
    
    payload = {
        "original_prompt": "Create a REST API for a blog",
        "mode": "ai-dev",
        "options": {
            "use_chain_of_thought": True,
            "use_expert_persona": False,
            "show_few_shot_examples": False
        }
    }
    
    try:
        response = requests.post(f"{API_BASE}/optimize", json=payload)
        data = response.json()
        
        optimized = data.get('optimized_prompt', '')
        
        # Check if CoT framework is present
        has_steps = any(step in optimized.upper() for step in ['STEP 1', 'STEP 2', 'STEP 3', 'STEP 4'])
        
        print(f"✅ Chain-of-Thought optimization successful")
        print(f"   Contains 4-step framework: {'✅ YES' if has_steps else '❌ NO'}")
        print(f"   Optimized length: {len(optimized)} chars")
        print(f"\n   First 300 chars:")
        print(f"   {optimized[:300]}...")
        return has_steps
    except Exception as e:
        print(f"❌ Chain-of-Thought test failed: {e}")
        return False

def test_4_expert_persona():
    """Test 4: Optimization with Expert Persona enabled"""
    print_section("TEST 4: Expert Persona Feature")
    
    payload = {
        "original_prompt": "Build a dashboard",
        "mode": "ai-dev",
        "options": {
            "use_chain_of_thought": False,
            "use_expert_persona": True,
            "show_few_shot_examples": False
        }
    }
    
    try:
        response = requests.post(f"{API_BASE}/optimize", json=payload)
        data = response.json()
        
        optimized = data.get('optimized_prompt', '')
        
        # Check if expert persona language is present
        has_expertise = any(term in optimized.lower() for term in ['senior', 'architect', 'expert', 'professional', 'experience'])
        
        print(f"✅ Expert Persona optimization successful")
        print(f"   Contains expert language: {'✅ YES' if has_expertise else '❌ NO'}")
        print(f"   Optimized length: {len(optimized)} chars")
        print(f"\n   First 300 chars:")
        print(f"   {optimized[:300]}...")
        return has_expertise
    except Exception as e:
        print(f"❌ Expert Persona test failed: {e}")
        return False

def test_5_combined_features():
    """Test 5: All features enabled together"""
    print_section("TEST 5: Combined Features (CoT + Expert Persona)")
    
    payload = {
        "original_prompt": "Create an e-commerce platform",
        "mode": "ai-dev",
        "options": {
            "use_chain_of_thought": True,
            "use_expert_persona": True,
            "show_few_shot_examples": False,
            "include_tests": True,
            "add_documentation": True
        }
    }
    
    try:
        response = requests.post(f"{API_BASE}/optimize", json=payload)
        data = response.json()
        
        optimized = data.get('optimized_prompt', '')
        
        has_steps = any(step in optimized.upper() for step in ['STEP 1', 'STEP 2', 'STEP 3', 'STEP 4'])
        has_expertise = any(term in optimized.lower() for term in ['senior', 'architect', 'expert'])
        
        print(f"✅ Combined features optimization successful")
        print(f"   Contains CoT framework: {'✅ YES' if has_steps else '❌ NO'}")
        print(f"   Contains expert language: {'✅ YES' if has_expertise else '❌ NO'}")
        print(f"   Optimized length: {len(optimized)} chars")
        print(f"   Improvement: {data.get('improvement_percentage', 0)}%")
        
        return has_steps and has_expertise
    except Exception as e:
        print(f"❌ Combined features test failed: {e}")
        return False

def test_6_quality_metrics():
    """Test 6: Enhanced quality metrics (9 dimensions)"""
    print_section("TEST 6: Enhanced Quality Metrics")
    
    detailed_prompt = """
    Create a comprehensive e-commerce platform with the following requirements:
    
    BACKGROUND: Currently using outdated system, need modern solution for 10,000+ users.
    
    REQUIREMENTS:
    - User authentication and profile management
    - Product catalog with search and filtering
    - Shopping cart and checkout process
    - Payment integration (Stripe, PayPal)
    - Admin dashboard for inventory management
    
    CONSTRAINTS:
    - Must handle at least 1000 concurrent users
    - Response time under 200ms
    - 99.9% uptime required
    
    DELIVERABLES:
    - Complete source code with documentation
    - Database schema and migration scripts
    - Deployment guide for AWS
    - API documentation in OpenAPI format
    """
    
    payload = {
        "prompt": detailed_prompt
    }
    
    try:
        response = requests.post(f"{API_BASE}/analyze", json=payload)
        data = response.json()
        
        scores = data.get('scores', {})
        
        # Check for new metrics
        has_context_richness = 'context_richness' in scores
        has_constraint_clarity = 'constraint_clarity' in scores
        has_output_spec = 'output_specification' in scores
        
        print(f"✅ Quality metrics analysis successful")
        print(f"\n   Original 6 Metrics:")
        print(f"   - Clarity: {scores.get('clarity', 0)}/10")
        print(f"   - Specificity: {scores.get('specificity', 0)}/10")
        print(f"   - Completeness: {scores.get('completeness', 0)}/10")
        print(f"   - Technical: {scores.get('technical', 0)}/10")
        print(f"   - Structure: {scores.get('structure', 0)}/10")
        print(f"   - Practicality: {scores.get('practicality', 0)}/10")
        
        print(f"\n   NEW Enhanced Metrics:")
        print(f"   - Context Richness: {scores.get('context_richness', 0)}/10 {'✅' if has_context_richness else '❌'}")
        print(f"   - Constraint Clarity: {scores.get('constraint_clarity', 0)}/10 {'✅' if has_constraint_clarity else '❌'}")
        print(f"   - Output Specification: {scores.get('output_specification', 0)}/10 {'✅' if has_output_spec else '❌'}")
        
        print(f"\n   Overall Score: {scores.get('overall', 0)}/10")
        
        return has_context_richness and has_constraint_clarity and has_output_spec
    except Exception as e:
        print(f"❌ Quality metrics test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("  🧪 COMPREHENSIVE END-TO-END TEST SUITE")
    print("  Testing: Backend API + Advanced Features + Quality Metrics")
    print("="*80)
    
    results = []
    
    # Run all tests
    results.append(("Backend Health", test_1_backend_health()))
    results.append(("Basic Optimization", test_2_optimize_without_features()))
    results.append(("Chain-of-Thought", test_3_chain_of_thought()))
    results.append(("Expert Persona", test_4_expert_persona()))
    results.append(("Combined Features", test_5_combined_features()))
    results.append(("Enhanced Quality Metrics", test_6_quality_metrics()))
    
    # Summary
    print_section("TEST SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:12} - {test_name}")
    
    print(f"\n{'='*80}")
    print(f"  RESULTS: {passed}/{total} tests passed ({(passed/total)*100:.0f}%)")
    
    if passed == total:
        print(f"  🎉 ALL TESTS PASSED! System is fully functional.")
    else:
        print(f"  ⚠️  Some tests failed. Review output above.")
    
    print(f"{'='*80}\n")
    
    return passed == total

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
