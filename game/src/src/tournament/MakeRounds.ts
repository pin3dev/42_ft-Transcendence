

function gerarRodadas(jogadores: string[]): [string, string][][] {
	if (jogadores.length % 2 !== 0) {
		throw new Error("Número de jogadores deve ser par.");
	}

	const totalRodadas = jogadores.length - 1;
	const metade = jogadores.length / 2;

	const jogadoresFixos = [...jogadores]; // para não alterar o original
	const rodadas: [string, string][][] = [];

	for (let rodada = 0; rodada < totalRodadas; rodada++) {
		const pares: [string, string][] = [];

		for (let i = 0; i < metade; i++) {
			const jogador1 = jogadoresFixos[i];
			const jogador2 = jogadoresFixos[jogadoresFixos.length - 1 - i];
			pares.push([jogador1, jogador2]);
		}

		rodadas.push(pares);

		// Rotaciona os jogadores (exceto o primeiro)
		const fixo = jogadoresFixos[0];
		const rotacionar = jogadoresFixos.splice(1);
		rotacionar.unshift(rotacionar.pop()!); // gira para a direita
		jogadoresFixos.splice(1, 0, ...rotacionar);
	}

	return rodadas;
}

// Exemplo de uso:
const jogadores = ["A", "B", "C", "D"];
const rodadas = gerarRodadas(jogadores);

rodadas.forEach((rodada, i) => {
	console.log(`Rodada ${i + 1}:`);
	rodada.forEach(([j1, j2]) => console.log(`  ${j1} vs ${j2}`));
});

