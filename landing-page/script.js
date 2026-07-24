const modeButtons = document.querySelectorAll('.mode-button');
const statusText = document.getElementById('statusText');
const dealName = document.getElementById('dealName');
const progressFill = document.getElementById('progressFill');
const progressNumber = document.getElementById('progressNumber');

const modes = {
  advertiser: {
    status: 'В работе',
    deal: 'UGC для Telegram',
    progress: '64%',
  },
  creator: {
    status: 'Результат принят',
    deal: 'Интеграция в канале',
    progress: '88%',
  },
};

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mode = modes[button.dataset.mode];
    modeButtons.forEach((item) => item.classList.toggle('active', item === button));
    statusText.textContent = mode.status;
    dealName.textContent = mode.deal;
    progressFill.style.width = mode.progress;
    progressNumber.textContent = mode.progress;
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.dataset.openAccess) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (window.lucide) {
  window.lucide.createIcons();
}

const accessModal = document.getElementById('accessModal');
const accessForm = document.getElementById('accessForm');
const formSuccess = document.getElementById('formSuccess');
const processModal = document.getElementById('processModal');
const processModalStep = document.getElementById('processModalStep');
const processModalKicker = document.getElementById('processModalKicker');
const processModalTitle = document.getElementById('processModalTitle');
const processModalLead = document.getElementById('processModalLead');
const processModalBody = document.getElementById('processModalBody');

const processDetails = {
  campaign: {
    step: '01',
    kicker: 'Создание кампании',
    title: 'Соберите бриф, по которому можно работать.',
    lead: 'Кампания в Adnet превращает идею в набор понятных условий: кому нужна реклама, в каком формате, на какой площадке и как будет приниматься результат.',
    cards: [
      ['Формат', 'Выберите рекламное размещение или UGC-production и укажите целевую площадку.'],
      ['Условия', 'Зафиксируйте цель, обязательные элементы, бюджет, дедлайн и критерии приемки.'],
      ['Публикация', 'Отправьте кампанию на модерацию, после чего она становится доступна исполнителям.'],
    ],
  },
  creator: {
    step: '02',
    kicker: 'Выбор исполнителя',
    title: 'Сравните предложения до того, как начнется работа.',
    lead: 'Вместо переписки в нескольких чатах рекламодатель видит отклики в единой структуре и может выбрать автора по существенным для сделки условиям.',
    cards: [
      ['Заявки', 'Цена, срок, комментарий автора, площадка и релевантные данные профиля собраны в одном списке.'],
      ['Выбор', 'После подтверждения автора создается карточка сделки с участниками, сроками и чек-листом.'],
      ['Бюджет', 'Рекламодатель переходит к резервированию бюджета у внешнего платежного провайдера.'],
    ],
  },
  review: {
    step: '03',
    kicker: 'Приемка результата',
    title: 'Подтвердите выполнение по доказательствам.',
    lead: 'Автор передает ссылку, файлы, скриншоты и другие Evidence. Рекламодатель принимает работу, запрашивает доработку или открывает спор с сохраненной историей сделки.',
    cards: [
      ['Evidence', 'Для размещения это ссылка и данные публикации; для UGC - файл, версия и согласованные права.'],
      ['Решение', 'Можно принять результат, запросить доработку или передать спор на рассмотрение модератору.'],
      ['Выплата', 'После приемки запускается выплата; финальные статусы и отчет остаются в карточке кампании.'],
    ],
  },
};

const openModal = (modal) => {
  if (modal && !modal.open) modal.showModal();
};

document.querySelectorAll('[data-open-access]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    accessForm.hidden = false;
    formSuccess.hidden = true;
    openModal(accessModal);
  });
});

document.querySelectorAll('[data-process]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const detail = processDetails[trigger.dataset.process];
    if (!detail) return;
    processModalStep.textContent = detail.step;
    processModalKicker.textContent = detail.kicker;
    processModalTitle.textContent = detail.title;
    processModalLead.textContent = detail.lead;
    processModalBody.innerHTML = detail.cards
      .map(([label, text]) => `<article class="process-detail"><span>${label}</span><p>${text}</p></article>`)
      .join('');
    openModal(processModal);
  });
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});

[accessModal, processModal].forEach((modal) => {
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
});

accessForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  accessForm.hidden = true;
  formSuccess.hidden = false;
});

const revealItems = document.querySelectorAll(
  '.statement-layout, .feature-card, .formats-head, .service-card, .formats-aside, .process-heading, .process-item, .platform-copy, .control-panel, .roles-heading, .role-panel, .cta-copy'
);

revealItems.forEach((item) => item.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));
