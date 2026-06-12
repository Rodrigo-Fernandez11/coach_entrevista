const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("1️⃣ Loading page in English (default)...");
    await page.goto("http://localhost:3002", { waitUntil: "networkidle" });

    // Check initial English content
    const titleEN = await page.textContent("h1");
    const subtitleEN = await page.textContent("p");
    const formHeadingEN = await page.textContent("h2");
    const buttonTextEN = await page
      .locator("button[type='submit']")
      .textContent();

    console.log(`   ✅ Title: "${titleEN}"`);
    console.log(`   ✅ Subtitle contains: "${subtitleEN?.substring(0, 50)}..."`);
    console.log(`   ✅ Form heading: "${formHeadingEN}"`);
    console.log(`   ✅ Button text: "${buttonTextEN}"`);

    // Verify English content
    if (
      titleEN !== "Interview Coach" ||
      !subtitleEN?.includes("Practice your answers")
    ) {
      throw new Error("❌ Default English content not found");
    }

    console.log("\n2️⃣ Clicking Spanish button...");
    const spanishBtn = page.locator("button:has-text('Español')");
    await spanishBtn.click();
    await page.waitForTimeout(500);

    // Check Spanish content
    const titleES = await page.textContent("h1");
    const subtitleES = await page.textContent("p");
    const formHeadingES = await page.textContent("h2");
    const buttonTextES = await page
      .locator("button[type='submit']")
      .textContent();

    console.log(`   ✅ Spanish title: "${titleES}"`);
    console.log(`   ✅ Spanish subtitle contains: "${subtitleES?.substring(0, 50)}..."`);
    console.log(`   ✅ Spanish form heading: "${formHeadingES}"`);
    console.log(`   ✅ Spanish button text: "${buttonTextES}"`);

    // Verify Spanish content
    if (
      !subtitleES?.includes("Practica tus respuestas") ||
      formHeadingES !== "Iniciar una nueva sesión"
    ) {
      throw new Error("❌ Spanish translation not applied");
    }

    console.log("\n3️⃣ Checking localStorage persistence...");
    const language = await page.evaluate(() =>
      localStorage.getItem("language")
    );
    console.log(`   ✅ localStorage language: "${language}"`);

    if (language !== "es") {
      throw new Error("❌ Language not saved to localStorage");
    }

    console.log("\n4️⃣ Reloading page to verify persistence...");
    await page.reload({ waitUntil: "networkidle" });

    const titleAfterReload = await page.textContent("h1");
    const subtitleAfterReload = await page.textContent("p");

    console.log(`   ✅ After reload - title: "${titleAfterReload}"`);
    console.log(
      `   ✅ After reload - subtitle contains: "${subtitleAfterReload?.substring(0, 50)}..."`
    );

    if (!subtitleAfterReload?.includes("Practica tus respuestas")) {
      throw new Error("❌ Spanish language not persisted after reload");
    }

    console.log("\n5️⃣ Switching back to English...");
    const englishBtn = page.locator("button:has-text('English')");
    await englishBtn.click();
    await page.waitForTimeout(500);

    const titleBackToEN = await page.textContent("h1");
    const subtitleBackToEN = await page.textContent("p");

    console.log(`   ✅ Back to English - title: "${titleBackToEN}"`);
    console.log(
      `   ✅ Back to English - subtitle contains: "${subtitleBackToEN?.substring(0, 50)}..."`
    );

    if (!subtitleBackToEN?.includes("Practice your answers")) {
      throw new Error("❌ Failed to switch back to English");
    }

    console.log("\n✨ All verification steps passed!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Verification failed:", error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
