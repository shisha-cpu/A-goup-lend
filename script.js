document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const calculatorModal = document.getElementById('calculatorModal');
    const form = document.getElementById('houseCostForm');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.querySelector('.form-btn-prev');
    const nextBtn = document.querySelector('.form-btn-next');
    const submitBtn = document.querySelector('.form-btn-submit');

document.body.appendChild(calculatorModal);
    let currentStep = 0;
    
    // Открытие модального окна
    calculateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calculatorModal.classList.add('active');
    });
    
    // Закрытие модального окна при клике вне формы
    calculatorModal.addEventListener('click', function(e) {
        if (e.target === calculatorModal) {
            calculatorModal.classList.remove('active');
            resetForm();
        }
    });
    
    // Навигация по шагам
    function showStep(step) {
        steps.forEach((stepElement, index) => {
            stepElement.classList.toggle('active', index === step);
        });
        
        prevBtn.disabled = step === 0;
        nextBtn.style.display = step === steps.length - 1 ? 'none' : 'block';
        submitBtn.style.display = step === steps.length - 1 ? 'block' : 'none';
    }
    
    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });
    
    prevBtn.addEventListener('click', function() {
        currentStep--;
        showStep(currentStep);
    });
    
    // Валидация шага
    function validateStep(step) {
        const currentStepElement = steps[step];
        const inputs = currentStepElement.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.checked && input.type !== 'checkbox' && input.value.trim() === '') {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        if (!isValid) {
            alert('Пожалуйста, заполните все обязательные поля');
        }
        
        return isValid;
    }
    
    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            const formData = new FormData(form);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Отправка данных в Telegram бот
            sendToTelegram(data);
            
            // Закрытие модального окна и сброс формы
            calculatorModal.classList.remove('active');
            resetForm();
            
            // Сообщение об успешной отправке
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
        }
    });
    
    // Функция отправки данных в Telegram
    function sendToTelegram(data) {
        const botToken = '7280093831:AAEHWCV0kg91xqrfdD7LOXhhZVyecv-AfZU';
        const chatId = '1137493485';
        
        let message = `Новый запрос на расчет стоимости дома:\n\n`;
        message += `Этажность: ${data.floors}\n`;
        message += `Площадь: ${data.area}\n`;
        message += `Цокольный этаж: ${data.basement}\n`;
        message += `Фундамент: ${data.foundation}\n`;
        message += `Когда заказать: ${data.timing}\n`;
        message += `Телефон: ${data.phone}`;
        
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
    }
    
    // Сброс формы
    function resetForm() {
        form.reset();
        currentStep = 0;
        showStep(currentStep);
    }
    
    // Инициализация первого шага
    showStep(currentStep);
    
    // Маска для телефона
    const phoneInput = document.querySelector('input[name="phone"]');
    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = '+7 (';
            if (value.length > 1) {
                formattedValue += value.substring(1, Math.min(4, value.length));
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(4, Math.min(7, value.length));
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(7, Math.min(9, value.length));
            }
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(9, Math.min(11, value.length));
            }
        }
        
        this.value = formattedValue;
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('catalogForm');
    const phoneInput = form.querySelector('input[type="tel"]');
  
    // Маска для телефона
    phoneInput.addEventListener('input', function(e) {
      let value = this.value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (value.length > 0) {
        formattedValue = '+7 (';
        if (value.length > 1) {
          formattedValue += value.substring(1, Math.min(4, value.length));
        }
        if (value.length >= 4) {
          formattedValue += ') ' + value.substring(4, Math.min(7, value.length));
        }
        if (value.length >= 7) {
          formattedValue += '-' + value.substring(7, Math.min(9, value.length));
        }
        if (value.length >= 9) {
          formattedValue += '-' + value.substring(9, Math.min(11, value.length));
        }
      }
      
      this.value = formattedValue;
    });
  
    // Отправка формы
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!form.checkValidity()) {
        alert('Пожалуйста, заполните все поля правильно');
        return;
      }
  
      const formData = new FormData(form);
      const phone = formData.get('phone');
  
      // Отправка в Telegram
      sendToTelegram(phone);
      

      // Очистка формы
      form.reset();
      alert('Спасибо! Каталог будет доступен для скачивания.');
    });
  
    function sendToTelegram(phone) {
      const botToken = '7280093831:AAEHWCV0kg91xqrfdD7LOXhhZVyecv-AfZU';
      const chatId = '1137493485';
      
      const message = `Новый запрос каталога:\nТелефон: ${phone}`;
      
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }).catch(error => console.error('Ошибка отправки в Telegram:', error));
    }
  });