import os
from urllib.parse import quote

from flask import Flask, Response, redirect, render_template, request


app = Flask(__name__)

WHATSAPP_NUMBER = "5541998004130"
INSTAGRAM_URL = "https://www.instagram.com/raiodesolesteticapremium/"


@app.get("/")
def index():
    return render_template(
        "index.html",
        whatsapp_number=WHATSAPP_NUMBER,
        instagram_url=INSTAGRAM_URL,
    )


@app.post("/agendar")
def agendar():
    nome = request.form.get("nome", "").strip()[:80]
    interesse = request.form.get("interesse", "Avaliação personalizada").strip()[:100]
    mensagem_extra = request.form.get("mensagem", "").strip()[:500]

    saudacao = f"Olá! Meu nome é {nome}. " if nome else "Olá! "
    mensagem = (
        f"{saudacao}Gostaria de agendar uma avaliação na Raio de Sol. "
        f"Tenho interesse em: {interesse}."
    )
    if mensagem_extra:
        mensagem += f"\n\nDetalhes: {mensagem_extra}"

    return redirect(f"https://wa.me/{WHATSAPP_NUMBER}?text={quote(mensagem)}", code=302)


@app.get("/robots.txt")
def robots():
    content = "User-agent: *\nAllow: /\nSitemap: {}/sitemap.xml\n".format(
        request.url_root.rstrip("/")
    )
    return Response(content, mimetype="text/plain")


@app.get("/sitemap.xml")
def sitemap():
    page_url = request.url_root.rstrip("/") + "/"
    content = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"  <url><loc>{page_url}</loc><priority>1.0</priority></url>\n"
        "</urlset>"
    )
    return Response(content, mimetype="application/xml")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
