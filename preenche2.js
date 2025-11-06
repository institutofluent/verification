// preenche.js
document.addEventListener('DOMContentLoaded', function () {
  fetch('dados2.html')
    .then(resp => resp.text())
    .then(text => {
      let dados = null;

      // tenta JSON direto
      try {
        dados = JSON.parse(text.trim());
      } catch (err) {
        // tenta extrair JSON de um HTML que contenha <div id="dados">{...}</div>
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          const dadosDiv = doc.querySelector('#dados');
          if (dadosDiv) {
            dados = JSON.parse(dadosDiv.textContent.trim());
          } else {
            // fallback: pega primeiro bloco JSON no texto
            const m = text.match(/\{[\s\S]*\}/);
            if (m) dados = JSON.parse(m[0]);
          }
        } catch (err2) {
          console.error('preenche.js - parse failed:', err2);
        }
      }

      if (!dados) {
        console.error('preenche.js: não foi possível obter dados válidos.');
        return;
      }

      const map = {
        data: 'data',
        aluno: 'aluno',
        cpf: 'cpf',
        nacionalidade: 'nacionalidade',
        natural: 'natural',
        nascimento: 'nascimento',
        filiacao: 'filiacao',
        curso: 'curso'
      };

      Object.keys(map).forEach(function(id) {
        const el = document.getElementById(id);
        const val = dados[ map[id] ];
        if (el) {
          el.textContent = val !== undefined && val !== null ? val : '';
          el.style.setProperty('color', '#666', 'important');
          el.style.setProperty('font-weight', '700', 'important');
        }
      });
    })
    .catch(err => console.error('preenche.js - fetch error:', err));
});
