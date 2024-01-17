# Plastic journey

Hra vypráví tragický příběh bezdomovce a jeho lahve Braníku. Bezdomovec lahev co nejvyšší silou hodí do Vltavy, načež se lahev při dopadu na vodní hladinu při dostatečné rychlosti odrazí. Odrážet se také může od kolem letících racků. Naopak při srážce s holubem hráč získá rychlostní boost, který může v libovolné chvíli využít.

Ovládání: Mezerník

Spuštění: npm run dev

Vypracování: samostatně

Knihovna: COLF.IO

Prostor: 2D, sidescroller

Objekty: Pet lahev (hráč), člověk, počítadlo skóre, počítadlo rychlostních boostů, rychlostní boosty (holubi), výškové boosty (racci)

Akce:
- hráč je vyhozen nad vodní hladinu
- odrážení se od vodní hladiny
- plavba pod vodou
- sbírání boostů, které mohou let okamžitě či po aktivaci hráčem ovlivnit
- výškové boosty (racci) se aktivují okamžitě odrazem lahve od racka
- rychlostní boosty se přičítají při srážce s holubem a hráč je může aktivovat kdykoliv, kdy má alespoň jeden
    
Pravidla:
- hra končí po dopadu na dno moře a ztrátě veškeré rychlosti
- hráč volí sílu hodu
- hráč se odráží od vodní hladiny, po ztrátě rychlosti klesá ke dnu
- boosty se náhodně generují
- boosty mohou zvýšit rychlost nebo výšku hráče

Cíl hry:
- dosáhnout co nejvyšší skóre

Hlavní mechanika:
- fyzika hodu a letu
