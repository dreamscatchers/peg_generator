from flask import Flask, render_template, request, jsonify
from parsimonious import Grammar

# Initialize a global grammar variable
grammar = None

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/parse_grammar', methods=['POST'])
def parse_grammar():
    global grammar  # Indicate that you're using the global grammar variable
    grammar_text = request.json.get('grammar', '')
    try:
        grammar = Grammar(grammar_text)
        result = "Grammar parsed successfully!"
        return jsonify({'success':'true', 'result':result})
    except Exception as e:
        # If there's a parsing error, return a message with the error details
        return jsonify({'success':False, 'error':f"Grammar parsing error: {str(e)}"})

@app.route('/parse_phrase', methods=['POST'])
def parse_phrase():
    if grammar is None:
        return jsonify({'success': False, 'error': "Grammar is not set or is invalid."})

    phrase = request.json.get('phrase', '')
    try:
        ast = grammar.parse(phrase)
        result = "Phrase parsed successfully!"
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        # If there's a parsing error for the phrase, return a message with the error details
        return jsonify({'success': False, 'error': f"Phrase parsing error: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)