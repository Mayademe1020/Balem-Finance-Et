describe('Slide Editor', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.clearLocalStorage();
  });

  it('should create a 5-slide deck', () => {
    cy.get('[data-testid="add-slide"]').should('exist');
    
    cy.get('[data-testid^="slide-thumbnail-"]').should('have.length', 1);
    
    for (let i = 0; i < 4; i++) {
      cy.get('[data-testid="add-slide"]').click();
      cy.wait(100);
    }
    
    cy.get('[data-testid^="slide-thumbnail-"]').should('have.length', 5);
    
    cy.get('[data-testid="slide-count"]').should('contain', '5 of 5 slides');
  });

  it('should add text to a slide', () => {
    cy.get('[data-testid="toolbar-text"]').click();
    
    cy.get('canvas').should('exist');
    
    cy.wait(500);
    
    cy.get('.properties').should('exist');
    cy.contains('Friendly Controls').should('exist');
  });

  it('should add a shape to a slide', () => {
    cy.get('[data-testid="toolbar-rectangle"]').click();
    
    cy.wait(500);
    
    cy.get('.properties').should('exist');
    cy.contains('Fill Color').should('exist');
  });

  it('should add multiple elements', () => {
    cy.contains('Big Text').click();
    cy.contains('Soft Box').click();
    cy.contains('Round Shape').click();
    
    cy.get('.properties').should('exist');
  });

  it('should duplicate a slide', () => {
    cy.contains('Big Text').click();
    
    cy.get('.slide-thumbnail').first().within(() => {
      cy.contains('Copy').click();
    });
    
    cy.get('.slide-thumbnail').should('have.length', 2);
  });

  it('should save and reload state', () => {
    cy.contains('Big Text').click();
    cy.contains('Soft Box').click();
    
    cy.reload();
    
    cy.get('.slide-thumbnail').should('have.length', 1);
  });

  it('should handle undo and redo', () => {
    cy.contains('Big Text').click();
    
    cy.contains('Undo').click();
    
    cy.contains('Redo').click();
  });

  it('should delete an element', () => {
    cy.contains('Big Text').click();
    
    cy.get('.properties').within(() => {
      cy.contains('Remove').click();
    });
    
    cy.get('.properties-empty').should('exist');
  });

  it('should create and navigate multiple slides', () => {
    cy.contains('Big Text').click();
    
    cy.get('[data-testid="add-slide"]').click();
    
    cy.contains('Soft Box').click();
    
    cy.get('.slide-thumbnail').first().click();
    
    cy.get('.slide-thumbnail').first().should('have.class', 'active');
  });
});
