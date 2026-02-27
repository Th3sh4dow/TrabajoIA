import { test, expect } from '@playwright/test';

test('flujo completo: explorar menú, botones, añadir al carrito', async ({ page }) => {
  // 1️⃣ Abrir la página Home
  await page.goto('http://localhost:5173'); // ajusta si tu app usa otro puerto

  // 2️⃣ Verificar botón "Explorar menú" y hacer click
  const explorarBtn = page.locator('text=EXPLORAR MENU');
  await expect(explorarBtn).toBeVisible({ timeout: 10000 });
  await explorarBtn.click();

  // 3️⃣ Verificar que llegamos al componente Menu
  await expect(page.locator('.divMenu')).toBeVisible({ timeout: 10000 });

  // 4️⃣ Verificar todos los botones de las pestañas del menú
  const platos = ["TODOS", "ENTRANTES", "PRIMEROS", "SEGUNDOS", "POSTRES", "BEBIDAS"];
  for (let i = 0; i < platos.length; i++) {
    const tabBtn = page.locator(`.menuButtons >> text=${platos[i]}`);
    await expect(tabBtn).toBeVisible({ timeout: 5000 });

    // Activar la pestaña
    await tabBtn.click();

    // Esperar que el contenido se renderice (los productos de esa pestaña)
    const productos = page.locator('.carousel >> .productCard'); // ajusta clase si tu ProductCard tiene otra
    const count = await productos.count();
    console.log(`Pestaña ${platos[i]} tiene ${count} productos`);

    // Verificar botones "Añadir" en los productos visibles
    const addBtns = productos.locator('text=Añadir');
    for (let j = 0; j < await addBtns.count(); j++) {
      await expect(addBtns.nth(j)).toBeVisible();
      // Opcional: hacer click para agregar al carrito
      await addBtns.nth(j).click();
    }
  }

  // 5️⃣ Verificar que el carrito tenga los productos añadidos
  const carritoItems = page.locator('.cartItem');
  await expect(carritoItems).toHaveCountGreaterThan(0); // al menos un item agregado

  // 6️⃣ Verificar botón "Finalizar compra"
  const checkoutBtn = page.locator('.checkoutBtn');
  await expect(checkoutBtn).toBeVisible({ timeout: 5000 });
});
