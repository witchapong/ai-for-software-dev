from check_setup import check_env, check_imports, check_python_version


def test_python_version_passes_on_supported_version():
    passed, message = check_python_version()
    assert passed is True
    assert "3.1" in message


def test_imports_pass_when_dependencies_installed():
    passed, message = check_imports()
    assert passed is True, message


def test_env_fails_when_no_key_present():
    passed, message = check_env({})
    assert passed is False
    assert "GEMINI_API_KEY" in message


def test_env_fails_when_key_is_still_the_placeholder():
    passed, message = check_env({"GEMINI_API_KEY": "paste-your-key-here"})
    assert passed is False
    assert "placeholder" in message.lower()


def test_env_passes_when_gemini_key_present():
    passed, _ = check_env({"GEMINI_API_KEY": "AIzaSyRealLookingKey123"})
    assert passed is True


def test_env_passes_when_only_mistral_key_present():
    passed, _ = check_env({"MISTRAL_API_KEY": "realmistralkey123"})
    assert passed is True
