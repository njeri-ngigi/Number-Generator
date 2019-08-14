import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import FileSaver from 'file-saver';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  afterEach(() => {
    // Remove components from DOM after testing
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render h1, h6 and button tags', () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('Genny');
    expect(element.querySelector('h6').textContent).toContain('A random phone number generator');
    expect(element.querySelector('button').textContent).toContain('GO');
  });

  it('should render empty message', () => {
    const emptyPElement = fixture.debugElement.query(By.css('.nothing')).nativeElement;
    expect(emptyPElement.textContent).toContain('First let\'s try generating some numbers');
  });


  it('should call generate numbers when button "GO" clicked', () => {
    const spy = spyOn(component, 'generateNumbers');
    const element = fixture.debugElement;
    const numbersInput = element.query(By.css('input')).nativeElement;
    const goBtn = element.query(By.css('button')).nativeElement;

    numbersInput.value = '5';
    numbersInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    goBtn.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('validateNumber', () => {
    it('should accept valid numbers', () => {
      const spy = spyOn(component, 'validateNumber');

      component.numbersValue = '10000';
      component.generateNumbers();

      expect(component.spanError).toBe(false);
      expect(component.spanErrorText).toBe('');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should catch numbers greater than 10000', () => {
      component.numbersValue = '10001';
      component.generateNumbers();

      expect(component.spanError).toBe(true);
      expect(component.spanErrorText).toBe('enter a valid number between 1 and 10,000');
    });
    it('should catch numbers less than 1', () => {
      component.numbersValue = '0';
      component.generateNumbers();

      expect(component.spanError).toBe(true);
      expect(component.spanErrorText).toBe('enter a valid number between 1 and 10,000');
    });
    it('should catch invalid characters', () => {
      component.numbersValue = 'qwew';
      component.generateNumbers();

      expect(component.spanError).toBe(true);
      expect(component.spanErrorText).toBe('enter a valid number between 1 and 10,000');
    });
    it('should catch empty values', () => {
      component.generateNumbers();

      expect(component.spanError).toBe(true);
      expect(component.spanErrorText).toBe('enter a valid number between 1 and 10,000');
    });
  });

  describe('generateNumbers', () => {
    beforeEach(() => {
      component.phoneNumbers = [];
    });

    it('length of phone numbers should be equal to 5', () => {
      component.numbersValue = '5';

      component.generateNumbers();

      expect(component.phoneNumbers.length).toBe(5);
    });

    it('should increment length of phoneNumbers when generateNumbers is called more than once', () => {
      component.numbersValue = '5';

      component.generateNumbers();
      component.generateNumbers();

      expect(component.phoneNumbers.length).toBe(10);
    });
  });

  describe('clearNumbers', () => {
    it('should clear phoneNumbers list', () => {
      component.numbersValue = '5';
      component.generateNumbers();
      expect(component.phoneNumbers.length).toBe(5);

      component.clearNumbers();
      expect(component.phoneNumbers.length).toBe(0);
    });
  });

  describe('downloadAsPDF', () => {
    let downloadSpy;

    beforeEach(() => {
      downloadSpy = spyOn(FileSaver, 'saveAs');
    });

    afterEach(() => {
      downloadSpy.calls.reset();
    });

    it('should download as PDF if length of phone numbers is > 0', () => {
      const element = fixture.debugElement;
      const numbersInput = element.query(By.css('input')).nativeElement;
      const goBtn = element.query(By.css('button')).nativeElement;

      numbersInput.value = '5';
      numbersInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      goBtn.click();
      fixture.detectChanges();


      const downloadBtn = fixture.debugElement.query(By.css('.download')).nativeElement;

      downloadBtn.click();
      fixture.detectChanges();
      expect(downloadSpy).toHaveBeenCalledTimes(1);
    });

    it('shouldn\'t call FileSaver.saveAs if length of phoneNumbers < 1', () => {
      component.clearNumbers();
      component.downloadAsPDF();

      expect(downloadSpy).not.toHaveBeenCalled();
    });
  });
});
