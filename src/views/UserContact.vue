<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-xl mx-auto bg-white rounded shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-center">Tabela de Preços</h2>
      <table class="w-full text-left border-collapse">
        <thead>
        <tr>
          <th class="border-b pb-2">Serviço</th>
          <th class="border-b pb-2 text-right">Valor</th>
        </tr>
        </thead>
        <tbody>
        <tr class="border-b">
          <td>Corte de Máquina</td>
          <td class="text-right">R$ 23,00</td>
        </tr>
        <tr class="border-b">
          <td>Corte de Tesoura</td>
          <td class="text-right">R$ 27,00</td>
        </tr>
        <tr class="border-b">
          <td>Barba</td>
          <td class="text-right">R$ 18,00</td>
        </tr>
        <tr class="border-b">
          <td>Sobrancelha</td>
          <td class="text-right">R$ 12,00</td>
        </tr>
        <tr class="border-b">
          <td>Corte Navalhado</td>
          <td class="text-right">R$ 32,00</td>
        </tr>
        <tr class="border-b">
          <td>Pé de Cabelo</td>
          <td class="text-right">R$ 10,00</td>
        </tr>
        <tr>
          <td>Pigmentação</td>
          <td class="text-right">R$ 15,00</td>
        </tr>
        </tbody>
      </table>

      <div class="mt-6 text-center">
        <p class="font-semibold text-blue-600">Trabalhamos com pigmentação</p>
        <p class="mt-2 text-sm text-gray-700">
          <strong>Contato:</strong> (71) 9 8689-2583
        </p>
        <p class="text-xs text-gray-500 mt-1">Agradecemos a preferência. Volte sempre!</p>

        <div class="mt-4 flex justify-center">
          <a
              href="https://www.instagram.com/marquinholijs?igsh=MXQyYW8zZWE0dnc3dg=="
              target="_blank"
              class="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <img
                src="../assets/instagram2.png"
                alt="Instagram"
                class="w-11 h-11 "
            />
            <span class="font-medium text-pink-600 hover:text-pink-700">
      @marquinholijs
    </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserContact',
};
</script>
